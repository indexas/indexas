import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from '@langchain/core/messages';

import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

import { DynamicModule, Logger, Module } from '@nestjs/common';
import { pull } from 'langchain/hub';
import { HttpService } from '@nestjs/axios';

const formatChatHistory = (chatHistory: any) => {
  if (Array.isArray(chatHistory)) {
    const updatedChat = chatHistory
      .map((dialogTurn: HumanMessage | AIMessage | SystemMessage) => {
        const mType = dialogTurn._getType();
        if (mType == 'human') {
          return `Human: ${dialogTurn.content}`;
        }
        if (mType === 'ai') {
          return `AI: ${dialogTurn.content}`;
        }
        if (mType == 'system') {
          return `System: ${dialogTurn.content}`;
        }
      })
      .join('\n');
    Logger.log(updatedChat, 'ChatService:formatChatHistory');
    return updatedChat;
  }
  return '';
};

export class Agent {
  private readonly httpService: HttpService;
  

  constructor() {
    this.httpService = new HttpService();
  }

  public async createDynamicChain({
    basePrompt,
    prompt,
    messages,
    indexIds,
  }: any): Promise<any> {
    const model = new ChatOpenAI({
      modelName: process.env.MODEL_CHAT as string,
      streaming: true,
      temperature: 0.0,
      maxRetries: 4,
    });

    let requestMessages = [];
    // Use provided messages; otherwise, use the prompt as the system message
    if (messages) {
      requestMessages = messages.map((m) => {
        switch (m.role) {
          case 'user':
            return new HumanMessage(m.content);
          case 'system':
            return new SystemMessage(m.content);
          default:
            return new AIMessage(m.content);
        }
      });
    }

    let systemMessage = null;
    if (prompt) {
      systemMessage = new SystemMessage(prompt);
    } else if (basePrompt) {
      systemMessage = await pull<ChatPromptTemplate>(basePrompt);
    }

    if (!systemMessage && requestMessages.length === 0) {
      throw new Error('No messages provided');
    }

    const promptTemplate = ChatPromptTemplate.fromMessages(
      systemMessage
        ? [systemMessage, new MessagesPlaceholder('messages')]
        : [new MessagesPlaceholder('messages')],
    );
    let retrievedDocs = '';

    if (indexIds) {
      // If exists
      const payload = {
        sources: indexIds,
      } as any;
      if (requestMessages.length > 0) {
        const embeddingModel = new OpenAIEmbeddings({
          modelName: process.env.MODEL_EMBEDDING as string,
        });
        const queryVector = await embeddingModel.embedQuery(
          formatChatHistory(requestMessages),
        );
        payload.vector = queryVector;
      }

      const response = await this.httpService.axiosRef({
        url: `${process.env.API_URL}/discovery/search`,
        method: 'POST',
        data: payload,
      });

      retrievedDocs = response.data
        .map((doc: any) => {
          if (doc.object === "cast") {
            return `Cast details: 
- text: ${doc.text}
- link: https://warpcast.com/${doc.author.username}/${doc.hash.substring(0, 12)}
- author: [${doc.author.name ? doc.author.name : doc.author.username}](https://warpcast.com/${doc.author.username})
- created_at: ${doc.timestamp}
              ----
`
          } else {
            return JSON.stringify(doc)
          }
          
        })
        .join('\n');

      // console.log({
      //   payload: JSON.stringify(payload),
      //   requestMessages,
      //   docs: response.data.map((d: any) => d.id),
      // });
    }

    const parser = new StringOutputParser();
    const retrievalChain = RunnableSequence.from([
      promptTemplate,
      model,
      parser,
    ]);

    return await retrievalChain.stream({
      context: retrievedDocs,
      messages: requestMessages,
    });
  }
}

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class AgentModule {
  static register(): DynamicModule {
    Logger.debug('Registering AgentModule...', 'AgentModule:register');

    return {
      module: AgentModule,
      global: true,
      providers: [
        {
          provide: 'AGENT_METACLASS',
          useFactory: (): Agent => {
            return new Agent();
          },
        },
      ],
      exports: ['AGENT_METACLASS'],
    };
  }
}

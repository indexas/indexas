import { ConversationService } from "../services/conversation.js";
import { DIDService } from "../services/did.js";
import { flattenSources, getAgentDID } from "../utils/helpers.js";
import axios from "axios";
export const handleUserMessage = async (
  message,
  runtimeDefinition,
  pubSubClient,
  redisClient,
) => {
  const definition = runtimeDefinition;
  const { id, messages, sources, ...rest } = message.conversation;

  const didService = new DIDService(definition);
  const agentDID = await getAgentDID();
  const conversationService = new ConversationService(definition).setDID(
    agentDID,
  );
  const reqIndexIds = await flattenSources(sources, didService);

  let isStopped = false;
  let isSaved = false;
  pubSubClient.subscribe(`stopChat`, async (stopId) => {
    if (stopId === id) {
      isStopped = true;
    }
  });

  const assistantMessage = await conversationService.createMessage(id, {
    role: "assistant",
    content: "",
  });

  try {
    const chatRequest = {
      indexIds: reqIndexIds,
      input: {
        question: messages.at(-1).content,
        chat_history: messages.slice(0, -1).map((c) => {
          return {
            id: c.id,
            role: c.role,
            content: c.content,
          };
        }),
      },
    };
    let resp = await axios.post(
      `${process.env.LLM_INDEXER_HOST}/chat/stream`,
      chatRequest,
      {
        responseType: "stream",
      },
    );

    let cmdMode = false;
    let inferredCmd = "";

    resp.data.on("data", async (chunk) => {
      if (isStopped && !isSaved) {
        isSaved = true;
        await conversationService.updateMessage(id, assistantMessage.id, {
          content: assistantMessage.content,
        });
        return;
      }
      const plainText = chunk.toString();
      if (plainText.includes("<<")) {
        cmdMode = true;
      } else if (plainText.includes(">>")) {
        cmdMode = false;
      } else if (cmdMode) {
        inferredCmd += plainText;
      } else {
        assistantMessage.content += plainText;
        await redisClient.publish(
          `agentStream:${id}:chunk`,
          JSON.stringify({
            chunk: plainText,
            name: "assistant",
            messageId: assistantMessage.id,
          }),
        );
      }
    });

    resp.data.on("end", async () => {
      // update last message
      console.log("Stream ended", inferredCmd);
      if (inferredCmd) {
        await redisClient.hSet(
          `subscriptions`,
          id,
          JSON.stringify({
            indexIds: reqIndexIds,
            messages,
          }),
        );
        // Future: save itent model
      }
      if (assistantMessage.content && !isStopped && !isSaved) {
        await redisClient.publish(
          `agentStream:${id}:end`,
          JSON.stringify({
            end: true,
            name: "assistant",
            messageId: assistantMessage.id,
          }),
        );
        await conversationService.updateMessage(id, assistantMessage.id, {
          content: assistantMessage.content,
        });
        // todo api save.
        isStopped = true;
        isSaved = true;
      }
    });
  } catch (error) {
    // Handle the exception
    console.error("An error occurred:", error.message);
  }
};
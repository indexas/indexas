import Col from "components/layout/base/Grid/Col";
import React, { useContext, useState } from "react";
import { useChat, type Message } from "ai/react";
import { ChatList } from "components/ai/chat-list";
import { ChatPanel } from "components/ai/chat-panel";
import { EmptyScreen } from "components/ai/empty-screen";
import { toast } from "react-hot-toast";
import AskInput from "components/base/AskInput";
import FlexRow from "components/layout/base/Grid/FlexRow";
import { ButtonScrollToBottom } from "components/ai/button-scroll-to-bottom";
import { API_ENDPOINTS } from "utils/constants";
import Flex from "components/layout/base/Grid/Flex";
import { maskDID } from "utils/helper";
import { useApp } from "@/context/AppContext";
import { ChatScrollAnchor } from "components/ai/chat-scroll-anchor";
import NoIndexesChat from "components/ai/no-indexes";
import { AuthContext } from "@/context/AuthContext";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}
export interface AskIndexesProps {
  chatID: string;
  did?: string;
  indexIds?: string[];
}

export interface MessageWithIndex extends Message {
  index?: number;
}

const AskIndexes: React.FC<AskIndexesProps> = ({ chatID, did, indexIds }) => {
  // const index = useIndex();
  const { viewedProfile, indexes: indexesFromApp, discoveryType } = useApp();

  const { session, status } = useContext(AuthContext);
  const { viewedIndex } = useApp();

  const { leftTabKey } = useApp();

  const [editingMessage, setEditingMessage] = useState<Message | undefined>();
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [editInput, setEditInput] = useState<string>("");

  const handleEditClick = (message: Message, indexOfMessage: number) => {
    setEditingMessage(message);
    setEditingIndex(indexOfMessage);
    setEditInput(message.content);
  };

  const handleSaveEdit = async () => {
    if (editingMessage) {
      const messagesBeforeEdit = messages.slice(0, editingIndex);

      const newMessage = {
        ...editingMessage,
        content: editInput,
      };

      setMessages(messagesBeforeEdit);
      setEditingMessage(undefined);
      setEditInput("");
      await append({
        id: chatID,
        content: newMessage.content,
        role: "user",
      });
    }
  };

  const getChatContextMessage = (): string => {
    if (viewedIndex) {
      return viewedIndex.title;
    }

    if (session && viewedProfile?.id === session.did.parent) {
      const sections = {
        owner: "indexes owned by you",
        starred: "indexes starred by you",
        all: "all your indexes",
      } as any;
      return sections[leftTabKey];
    }

    if (viewedProfile?.id) {
      const sections = {
        owner: "indexes owned by",
        starred: "indexes starred by",
        all: "all indexes of",
      } as any;

      return `${sections[leftTabKey]} ${viewedProfile.name || maskDID(viewedProfile.id)}`;
    }

    return `indexes`;
  };

  const apiUrl = `https://dev.index.network/api${API_ENDPOINTS.CHAT_STREAM}`;
  const initialMessages: Message[] = [];
  const {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
    setMessages,
  } = useChat({
    api: apiUrl,
    initialMessages,
    id: chatID,
    body: {
      id: chatID,
      did,
      indexIds,
    },
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${session?.serialize()}`,
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText);
      }
    },
  });

  if (indexesFromApp.length === 0) {
    return <NoIndexesChat isSelfDid={did === viewedProfile?.id} />;
  }

  return (
    <>
      <Flex
        id={chatID}
        key={chatID}
        className={indexIds ? "px-0 pt-7" : "px-md-10 px-0 px-4 pt-7"}
        flexdirection={"column"}
        style={{
          display: "flex", // Ensure it's a flex container
          flexDirection: "column", // Stack children vertically
          height: "100%", // Take full available height
        }}
      >
        <FlexRow wrap={true} align={"start"} style={{ flex: "1 1 auto" }}>
          <Col
            className="idxflex-grow-1"
            style={{
              overflowY: "auto",
              flex: "1", // Allow this container to grow and fill available space
            }}
          >
            {messages.length ? (
              <>
                <ChatList
                  messages={messages}
                  handleEditClick={handleEditClick}
                  editingMessage={editingMessage}
                  setEditInput={setEditInput}
                  editInput={editInput}
                  handleSaveEdit={handleSaveEdit}
                  editingIndex={editingIndex}
                />
                <ChatScrollAnchor trackVisibility={isLoading} />
              </>
            ) : (
              <Flex className="px-8">
                <EmptyScreen
                  contextMessage={getChatContextMessage()}
                  setInput={setInput}
                  indexIds={indexIds}
                />
              </Flex>
            )}
          </Col>
        </FlexRow>
      </Flex>
      <Flex
        className={"chat-input idxflex-grow-1 px-md-10"}
        flexdirection={"column"}
      >
        <FlexRow className={"mb-5"} justify={"center"} align={"center"}>
          <ChatPanel
            isLoading={isLoading}
            stop={stop}
            reload={reload}
            messages={messages}
          />
        </FlexRow>
        <FlexRow fullWidth className={"idxflex-grow-1"} colGap={0}>
          <Col className="idxflex-grow-1 pb-8" style={{ background: "white" }}>
            <AskInput
              contextMessage={getChatContextMessage()}
              onSubmit={async (value) => {
                await append({
                  id: chatID,
                  content: value,
                  role: "user",
                });
              }}
              isLoading={isLoading}
              input={input}
              setInput={setInput}
            />
          </Col>
        </FlexRow>
      </Flex>
      {false && (
        <div
          style={{
            right: "30px",
            bottom: "70px",
            position: "fixed",
          }}
        >
          <ButtonScrollToBottom />
        </div>
      )}
    </>
  );
};

export default AskIndexes;

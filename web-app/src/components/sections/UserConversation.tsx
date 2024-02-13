import AskIndexes from "components/site/indexes/AskIndexes";
import { useRouteParams } from "hooks/useRouteParams";
import { useApp } from "@/context/AppContext";

export default function UserConversationSection() {
  const { id } = useRouteParams();
  const { chatID } = useApp();

  if (!chatID || !id) {
    return null;
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        maxHeight: "calc(100dvh - 12em)",
      }}
    >
      <AskIndexes chatID={chatID} did={id} />;
    </div>
  );
}

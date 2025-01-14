import HistoryItem from "./HistoryItem";

const ConversationHistory = ({ items }: { items: any }) => {
  return (
    <div
      className={"scrollable-area "}
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "16px 16px 30px 0px",
          display: "flex",
          gap: "12px",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {items.map((item: any) => {
          return <HistoryItem key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
};

export default ConversationHistory;

import moment from "moment";
import { useRouter } from "next/navigation";

type HistoryItemProps = {
  id: string;
  summary: string;
  link: string;
  timestamp: string;
};

const HistoryItem = ({ item }: { item: HistoryItemProps }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(`/conversation/${item.id}`);
      }}
    >
      <div
        style={{
          borderRadius: "4px",
          padding: "12px",
          border: "1px solid var(--gray-2)",
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          cursor: "pointer",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {item.summary}
        </h2>

        <p
          style={{
            fontSize: "12px",
            margin: 0,
          }}
        >
          {/* Last message 10 days ago */}
          {item?.createdAt
            ? `Updated ${moment(new Date(item.createdAt)).fromNow()}`
            : ""}
        </p>
      </div>
    </div>
  );
};

export default HistoryItem;

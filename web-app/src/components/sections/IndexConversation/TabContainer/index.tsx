import { Tabs } from "@/components/base/Tabs";
import TabPane from "@/components/base/Tabs/TabPane";
import Col from "@/components/layout/base/Grid/Col";
import FlexRow from "@/components/layout/base/Grid/FlexRow";
import { useApp } from "@/context/AppContext";
import { useOrderedFetch } from "@/hooks/useOrderedFetch";
import { useRouteParams } from "@/hooks/useRouteParams";
import { useCallback, useEffect, useState } from "react";
import { useIndexConversation } from "../IndexConversationContext";
import AccessControlTab from "./AccessControlTab";
import ChatTab from "./ChatTab";
import IndexItemsTab from "./IndexItemsTab";
import IndexSettingsTab from "./SettingsTab";

enum TabKey {
  Chat = "chat",
  Index = "index",
  // Creators = "creators",
  AccessControl = "access_control",
  Settings = "settings",
}

const TAB_TITLES = {
  [TabKey.Chat]: "Chat",
  [TabKey.Index]: "Index",
  // [TabKey.Creators]: "Creators",
  [TabKey.AccessControl]: "Access Control",
  [TabKey.Settings]: "Developers",
};

export default function TabContainer() {
  const [tabKey, setTabKey] = useState<string>(TabKey.Chat);

  const { id } = useRouteParams();
  const { fetchDataForNewRoute } = useOrderedFetch();
  const { itemsState, loading } = useIndexConversation();
  const { viewedIndex } = useApp();

  useEffect(() => {
    if (!viewedIndex) return;

    if (loading) {
      return;
    }

    if (itemsState.items.length === 0) {
      setTabKey(TabKey.Index);
    } else {
      setTabKey(TabKey.Chat);
    }
  }, [viewedIndex]);

  useEffect(() => {
    if (!viewedIndex || !viewedIndex.id) return;
    fetchDataForNewRoute(viewedIndex.id);
  }, [fetchDataForNewRoute]);

  const renderTabContent = useCallback(() => {
    switch (tabKey) {
      case TabKey.Chat:
        return <ChatTab />;
      case TabKey.Index:
        return <IndexItemsTab />;
      // case TabKey.Creators:
      //  return <CreatorsTab />;
      case TabKey.AccessControl:
        return <AccessControlTab />;
      case TabKey.Settings:
        return <IndexSettingsTab />;
      default:
        return <ChatTab />;
    }
  }, [tabKey]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <FlexRow>
        <Col className="idxflex-grow-1 mt-3">
          <Tabs activeKey={tabKey} onTabChange={setTabKey}>
            {Object.values(TabKey).map((key) => (
              <TabPane
                key={key}
                enabled={true}
                hidden={false}
                tabKey={key}
                title={TAB_TITLES[key]}
              />
            ))}
          </Tabs>
        </Col>
      </FlexRow>
      <FlexRow>
        <div
          style={{
            flex: 1,
          }}
        >
          {renderTabContent()}
        </div>
      </FlexRow>
    </div>
  );
}

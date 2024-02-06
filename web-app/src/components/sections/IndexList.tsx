import List from "components/base/List";
import { Tabs } from "components/base/Tabs";
import TabPane from "components/base/Tabs/TabPane";
import Text from "components/base/Text";
import Col from "components/layout/base/Grid/Col";
import FlexRow from "components/layout/base/Grid/FlexRow";
import { IndexListTabKey, useApp } from "@/context/AppContext";
import IndexItem from "components/site/indexes/IndexItem";
import { useRouteParams } from "hooks/useRouteParams";
import React, { useCallback, useMemo } from "react";
import { Indexes } from "types/entity";

const IndexListSection: React.FC = () => {
  const { id } = useRouteParams();

  const { indexes, setLeftTabKey, leftTabKey } = useApp();

  const handleTabChange = useCallback(
    (tabKey: IndexListTabKey) => {
      setLeftTabKey(tabKey);
    },
    [setLeftTabKey],
  );

  const sectionIndexes = useMemo(() => {
    if (leftTabKey === IndexListTabKey.ALL) {
      return indexes;
    }
    if (leftTabKey === IndexListTabKey.OWNER) {
      return indexes.filter((i) => i.did.owned);
    }
    if (leftTabKey === IndexListTabKey.STARRED) {
      return indexes.filter((i) => i.did.starred);
    }
    return [];
  }, [indexes, leftTabKey]);

  return (
    <>
      <FlexRow className={"mr-6 pb-4"}>
        <Col className="idxflex-grow-1">
          <Tabs
            destroyInactiveTabPane={false}
            theme={"rounded"}
            activeKey={leftTabKey}
            onTabChange={handleTabChange}
          >
            <TabPane
              enabled={true}
              tabKey={IndexListTabKey.ALL}
              title={`All Indexes`}
            />
            <TabPane
              enabled={true}
              tabKey={IndexListTabKey.OWNER}
              total={indexes.filter((i) => i.did.owned).length}
              title={`Owned`}
            />
            <TabPane
              enabled={true}
              tabKey={IndexListTabKey.STARRED}
              total={indexes.filter((i) => i.did.starred).length}
              title={`Starred`}
            />
          </Tabs>
        </Col>
      </FlexRow>
      <FlexRow className={"scrollable-area index-list idxflex-grow-1 pr-6"}>
        {sectionIndexes.length > 0 ? (
          <div className={"idxflex-grow-1"}>
            <List
              data={sectionIndexes}
              render={(itm: Indexes) => (
                <>
                  <IndexItem index={itm} selected={itm.id === id} />
                </>
              )}
              divided={false}
            />
          </div>
        ) : (
          <Text
            fontWeight={500}
            style={{
              color: "var(--gray-4)",
              textAlign: "center",
              padding: "4rem 0",
              margin: "auto",
            }}
          >
            There are no indexes yet
          </Text>
        )}
      </FlexRow>
    </>
  );
};

export default IndexListSection;

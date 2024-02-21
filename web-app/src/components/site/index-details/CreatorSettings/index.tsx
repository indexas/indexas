import { useApi } from "@/context/APIContext";
import { useApp } from "@/context/AppContext";
import Button from "components/base/Button";
import Header from "components/base/Header";
import IconAdd from "components/base/Icon/IconAdd";
import Text from "components/base/Text";
import Col from "components/layout/base/Grid/Col";
import FlexRow from "components/layout/base/Grid/FlexRow";
import Row from "components/layout/base/Grid/Row";
import NewCreatorModal from "components/site/modal/NewCreatorModal";
import { useRole } from "hooks/useRole";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AccessControlCondition } from "types/entity";
import CreatorRule from "./CreatorRule";

const CreatorSettings = () => {
  const { isOwner } = useRole();
  const { viewedIndex, setViewedIndex, createConditions } = useApp();

  const { api, ready: apiReady } = useApi();
  const [newCreatorModalVisible, setNewCreatorModalVisible] = useState(false);
  const { setTransactionApprovalWaiting } = useApp();
  const [conditions, setConditions] = useState<any>([]);
  const loadActionRef = useRef(false);

  const creators = useMemo(
    () => conditions.filter((action: any) => action.tag === "creators") as any,
    [conditions],
  );

  // const handleActionChange = useCallback(
  //   async ({ cid }: CreatorAction) => {
  //     if (!viewedIndex || !apiReady) return;

  //     debugger;
  //     try {
  //       // There's a risk here.
  //       // If the user refreshes the page before the transaction is mined, the UI will show the old value.
  //       await litService.writeAuthMethods({
  //         cid,
  //         signerPublicKey: viewedIndex.signerPublicKey!,
  //         signerFunction: viewedIndex.signerFunction!,
  //       });
  //       const updatedIndex = await api!.updateIndex(viewedIndex?.id, {
  //         signerFunction: cid,
  //       });
  //       setViewedIndex(updatedIndex);
  //     } catch (error) {
  //       console.error("Error creating rule", error);
  //     }
  //   },
  //   [api, viewedIndex, apiReady],
  // );

  const loadActions = useCallback(async () => {
    if (!apiReady || !viewedIndex) return;
    if (loadActionRef.current) return;
    loadActionRef.current = true;

    const litActions = await api!.getLITAction(viewedIndex.signerFunction);
    if (litActions && litActions.length > 0) {
      setConditions(litActions as any);
    }

    loadActionRef.current = false;
  }, [apiReady, viewedIndex]);

  const handleRemove = useCallback(
    async (i: number) => {
      if (!apiReady) return;
      setNewCreatorModalVisible(false);
      setTransactionApprovalWaiting(true);

      try {
        const deepCopyOfConditions = JSON.parse(JSON.stringify(conditions));

        const newConditions = [
          ...deepCopyOfConditions.slice(0, i),
          ...deepCopyOfConditions.slice(i + 1),
        ];
        await createConditions(newConditions);
      } catch (error) {
        console.error("Error creating rule", error);
      } finally {
        setTransactionApprovalWaiting(false);
      }
    },
    [apiReady],
  );

  const handleCreate = useCallback(
    async (condition: AccessControlCondition) => {
      if (!apiReady || conditions.length === 0) return;

      setNewCreatorModalVisible(false);
      setTransactionApprovalWaiting(true);
      try {
        const deepCopyOfConditions = JSON.parse(JSON.stringify(conditions));
        const newConditions = [
          {
            tag: "creator",
            value: condition,
          },
          ...deepCopyOfConditions,
        ] as AccessControlCondition[];
        await createConditions(newConditions);
      } catch (error) {
        console.error("Error creating rule", error);
      } finally {
        setTransactionApprovalWaiting(false);
      }
    },
    [apiReady, conditions],
  );

  const handleToggleNewCreatorModal = useCallback(() => {
    setNewCreatorModalVisible(!newCreatorModalVisible);
  }, [newCreatorModalVisible]);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  return (
    <>
      <Row noGutters>
        <Col pullLeft>
          <Header className="mb-4" theme="gray6">
            Creators
          </Header>
        </Col>
        {isOwner && (
          <Col pullRight>
            <Button
              addOnBefore
              className={"mr-0"}
              size="sm"
              onClick={handleToggleNewCreatorModal}
            >
              <IconAdd width={12} stroke="white" strokeWidth={"1.5"} /> Add New
            </Button>
          </Col>
        )}
      </Row>
      <Row className={"mt-0"}>
        <Col xs={10}>
          <Text fontFamily="freizeit" size={"lg"} fontWeight={500}>
            {isOwner && (
              <>
                Control write access to your index through NFTs.
                <br />
              </>
            )}
            Creators can add items, add tags to theirs and delete them.
          </Text>
        </Col>
      </Row>
      <FlexRow className={"mt-6"} rowGutter={0} rowSpacing={2} colSpacing={2}>
        {creators.length > 0 &&
          creators.map((c: any, i: any) => (
            <Col key={i} lg={6} xs={12}>
              <CreatorRule
                handleRemove={() => handleRemove(i)}
                rule={c.metadata}
              ></CreatorRule>
            </Col>
          ))}
        {creators.length === 0 && (
          <>
            <Col
              className={"mt-4"}
              xs={12}
              centerBlock
              style={{
                height: 166,
                display: "grid",
                placeItems: "center",
              }}
            >
              <img src="/images/no_indexes.png" alt="No Indexes" />
            </Col>
            <Col className="text-center" centerBlock>
              <Header
                level={4}
                style={{
                  maxWidth: 350,
                }}
              >
                No creators, yet.
              </Header>
            </Col>
          </>
        )}
      </FlexRow>
      {newCreatorModalVisible && (
        <NewCreatorModal
          handleCreate={handleCreate}
          visible={newCreatorModalVisible}
          onClose={handleToggleNewCreatorModal}
        ></NewCreatorModal>
      )}
    </>
  );
};

export default CreatorSettings;

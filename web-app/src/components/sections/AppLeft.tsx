import cc from "classcat";
import Avatar from "components/base/Avatar";
import Button from "components/base/Button";
import Header from "components/base/Header";
import IconClose from "components/base/Icon/IconClose";
import Text from "components/base/Text";
import Col from "components/layout/base/Grid/Col";
import Flex from "components/layout/base/Grid/Flex";
import FlexRow from "components/layout/base/Grid/FlexRow";
import { useApp } from "@/context/AppContext";
import { maskDID } from "utils/helper";
import IndexListSection from "./IndexList";

const AppLeft = () => {
  const { leftSidebarOpen, setLeftSidebarOpen, viewedProfile } = useApp();

  return (
    <Col
      className={cc([
        "sidebar-left",
        leftSidebarOpen ? "sidebar-open" : "sidebar-closed",
      ])}
    >
      <FlexRow>
        <Col xs={12}>
          <Flex flexdirection={"column"} className={"scrollable-container"}>
            <Flex
              alignitems={"right"}
              className={"navbar-sidebar-handlers mr-6 mt-6 "}
            >
              <Button
                onClick={() => setLeftSidebarOpen(false)}
                iconButton
                theme="clear"
              >
                <IconClose width={32} />
              </Button>
            </Flex>
            <FlexRow
              wrap={false}
              className={"my-6 mr-6 p-6"}
              style={{ background: "var(--gray-7)", borderRadius: "5px" }}
            >
              <Col>
                <Avatar size={60} placeholder={"black"} user={viewedProfile} />
              </Col>
              <Col className="idxflex-grow-1 ml-6">
                <Flex flexdirection={"column"}>
                  {!viewedProfile ? (
                    <>
                      <Text
                        style={{
                          width: "8em",
                          background: "var(--gray-2)",
                          height: "1.5em",
                        }}
                        className={"my-1"}
                        theme="gray6"
                        size="sm"
                        verticalAlign="middle"
                        fontWeight={500}
                        element="p"
                      ></Text>
                      <Text
                        style={{
                          width: "16em",
                          background: "var(--gray-2)",
                          height: "1.5em",
                        }}
                        className={"my-0"}
                        theme="gray6"
                        size="sm"
                        verticalAlign="middle"
                        fontWeight={500}
                        element="p"
                      ></Text>
                    </>
                  ) : (
                    <>
                      <Header level={4} className={"mb-1"}>
                        {viewedProfile?.name
                          || (viewedProfile?.id
                            ? maskDID(viewedProfile?.id!)
                            : "")}
                      </Header>
                      <Text
                        className={"my-0"}
                        theme="gray6"
                        size="sm"
                        verticalAlign="middle"
                        fontWeight={500}
                        element="p"
                      >
                        {viewedProfile?.bio}
                      </Text>
                    </>
                  )}
                </Flex>
              </Col>
            </FlexRow>
            <IndexListSection />
          </Flex>
        </Col>
      </FlexRow>
    </Col>
  );
};

export default AppLeft;

import { useApp } from "@/context/AppContext";
import Freizeit from "@/fonts/loader";
import { selectDID } from "@/store/slices/didSlice";
import { useAppSelector } from "@/store/store";
import cc from "classcat";
import Avatar from "components/base/Avatar";
import Button from "components/base/Button";
import Header from "components/base/Header";
import IconClose from "components/base/Icon/IconClose";
import Text from "components/base/Text";
import Col from "components/layout/base/Grid/Col";
import Flex from "components/layout/base/Grid/Flex";
import FlexRow from "components/layout/base/Grid/FlexRow";
import { maskDID } from "utils/helper";
import LoadingText from "../base/Loading";
import IndexListSection from "./IndexList";

const AppLeft = () => {
  const { leftSidebarOpen, setLeftSidebarOpen } = useApp();

  const { data: viewedProfile } = useAppSelector(selectDID);

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
                  <>
                    <LoadingText val={viewedProfile?.name || viewedProfile?.id}>
                      <Header
                        level={4}
                        className={cc(["mb-1", Freizeit.className])}
                      >
                        {
                          /* eslint-disable */
                          viewedProfile?.name ||
                            (viewedProfile?.id
                              ? maskDID(viewedProfile?.id!)
                              : "")
                        }
                      </Header>
                    </LoadingText>
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

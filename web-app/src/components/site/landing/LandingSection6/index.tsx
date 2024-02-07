import Header from "components/base/Header";
import Col from "components/layout/base/Grid/Col";
import Flex from "components/layout/base/Grid/Flex";
import Row from "components/layout/base/Grid/Row";
import React from "react";
import cc from "classcat";
import Text from "components/base/Text";
import { useBreakpoint } from "hooks/useBreakpoint";
import { BREAKPOINTS } from "utils/constants";
import Container from "components/layout/base/Grid/Container";
import LandingSection from "../LandingSection";
import cm from "./style.module.scss";

const LandingSection6: React.VFC = () => {
  const breakpoint = useBreakpoint(BREAKPOINTS);

  return (
    <LandingSection noContainer>
      {breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md" ? (
        <Container style={{ width: "100%" }}>
          <Flex
            flexdirection="column"
            style={{
              marginBottom: "17rem",
              marginTop: "6.4rem",
            }}
          >
            <Header className="lnd-5-title">The Road Ahead</Header>
            <Flex
              style={{
                marginTop: "2.4rem",
              }}
            >
              <div>
                <img
                  className={cm.imgH}
                  alt="steps-png"
                  src="/images/step-h.png"
                />
              </div>
              <Flex
                flexdirection="column"
                flexGrow={1}
                style={{
                  paddingLeft: "4rem",
                }}
                gap={"4rem"}
              >
                <Flex
                  flexdirection="column"
                  style={{
                    marginTop: -4,
                  }}
                >
                  <Header level={4}>Q1 2022</Header>
                  <Header level={2}>Validation</Header>
                  <ul className={cm.list2}>
                    <li>
                      <Text theme="secondary">MVP on Web2</Text>
                    </li>
                    <li>
                      <Text theme="secondary">
                        Test and validate use case with 1K users
                      </Text>
                    </li>
                  </ul>
                </Flex>
                <Flex
                  flexdirection="column"
                  style={{
                    marginTop: -10,
                  }}
                >
                  <Header level={4}>Q3 2022</Header>
                  <Header level={2}>Alpha</Header>
                  <ul className={cm.list2}>
                    <li>
                      <Text theme="secondary">
                        Indexing web links using Ceramic Network and IPFS
                      </Text>
                    </li>
                    <li>
                      <Text theme="secondary">
                        Enabling search within indexes
                      </Text>
                    </li>
                  </ul>
                </Flex>
                <Flex
                  flexdirection="column"
                  style={{
                    marginTop: -10,
                  }}
                >
                  <Header level={4}>Q4 2022</Header>
                  <Header level={2}>Beta</Header>
                  <ul className={cm.list2}>
                    <li>
                      <Text theme="secondary">
                        Collaborative indexing with Lit Protocol
                      </Text>
                    </li>
                    <li>
                      <Text theme="secondary">
                        Subscription enabled discovery engines with Unlock
                        Protocol
                      </Text>
                    </li>
                    <li>
                      <Text theme="secondary">
                        Experiments with DAOs, companies and individual
                        creators.
                      </Text>
                    </li>
                  </ul>
                </Flex>
                <Flex
                  flexdirection="column"
                  style={{
                    marginTop: -12,
                  }}
                >
                  <Header level={4}>Q1 2023</Header>
                  <Header level={2}>V1</Header>
                  <ul className={cm.list2}>
                    <li>
                      <Text theme="secondary">
                        Social graph integration with Lens Protocol
                      </Text>
                    </li>
                    <li>
                      <Text theme="secondary">
                        Enabling browser extension and highlighted content
                      </Text>
                    </li>
                    <li>
                      <Text theme="secondary">
                        Featuring custom view options and filters
                      </Text>
                    </li>
                    <li>
                      <Text theme="secondary">
                        Launching subscription based monetization
                      </Text>
                    </li>
                  </ul>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      ) : (
        <Flex
          flexdirection="column"
          gap={"32px"}
          className={cc(["lnd-card", "lnd-steps"])}
        >
          <Header className="lnd-5-title">The Road Ahead</Header>
          <Row>
            <Col xs={3}>
              <Header level={4}>Q1 2022</Header>
            </Col>
            <Col xs={3}>
              <Header level={4}>Q3 2022</Header>
            </Col>
            <Col xs={3}>
              <Header level={4}>Q4 2022</Header>
            </Col>
            <Col xs={3}>
              <Header level={4}>Q1 2023</Header>
            </Col>
            <Col xs={12}>
              <img
                className={cm.img}
                alt="steps-png"
                src="/images/steps2.png"
              />
            </Col>
            <Col xs={12} className="mt-lg-8">
              <Row>
                <Col xs={3}>
                  <Flex flexdirection="column">
                    <Header level={2}>Validation</Header>
                    <ul className={cm.list}>
                      <li>
                        <Text theme="secondary">MVP on Web2</Text>
                      </li>
                      <li>
                        <Text theme="secondary">
                          Test and validate use case with 1K users
                        </Text>
                      </li>
                    </ul>
                  </Flex>
                </Col>
                <Col xs={3}>
                  <Flex flexdirection="column">
                    <Header level={2}>Alpha</Header>
                    <ul className={cm.list}>
                      <li>
                        <Text theme="secondary">
                          Indexing web links using Ceramic Network and IPFS
                        </Text>
                      </li>
                      <li>
                        <Text theme="secondary">
                          Enabling search within indexes
                        </Text>
                      </li>
                    </ul>
                  </Flex>
                </Col>
                <Col xs={3}>
                  <Flex flexdirection="column">
                    <Header level={2}>Beta</Header>
                    <ul className={cm.list}>
                      <li>
                        <Text theme="secondary">
                          Enabling monetization and collaboration with Lit
                          Protocol
                        </Text>
                      </li>
                      <li>
                        <Text theme="secondary">
                          Featuring multi-use ownership with Gnosis safe
                        </Text>
                      </li>
                      <li>
                        <Text theme="secondary">
                          Collaboration with DAOs, companies and individual
                          creators
                        </Text>
                      </li>
                    </ul>
                  </Flex>
                </Col>
                <Col xs={3}>
                  <Flex flexdirection="column">
                    <Header level={2}>V1</Header>
                    <ul className={cm.list}>
                      <li>
                        <Text theme="secondary">
                          Browser extension and highlighted content
                        </Text>
                      </li>
                      <li>
                        <Text theme="secondary">
                          Featuring custom view options and filters
                        </Text>
                      </li>
                      <li>
                        <Text theme="secondary">Token curated indexes</Text>
                      </li>
                      <li>
                        <Text theme="secondary">Index bundling</Text>
                      </li>
                    </ul>
                  </Flex>
                </Col>
              </Row>
            </Col>
          </Row>
        </Flex>
      )}
    </LandingSection>
  );
};

export default LandingSection6;

'use client';

import Header from "components/base/Header";
import Text from "components/base/Text";
import React, { useContext, useEffect } from "react";
import cc from "classcat";
import Button from "components/base/Button";
import { useRouter } from "next/navigation";
import { AuthContext, AuthStatus } from "components/site/context/AuthContext";

import { useTranslation } from "next-i18next";
import Flex from "components/layout/base/Grid/Flex";
import FlexRow from "components/layout/base/Grid/FlexRow";
import Col from "components/layout/base/Grid/Col";
import LandingSection from "../LandingSection";
import cm from "./style.module.scss";

const LandingSection1 = () => {
  const router = useRouter();
  const { t } = useTranslation(["common", "components"]);

  const { status, session, connect } = useContext(AuthContext);

  useEffect(() => {
    if (status === AuthStatus.CONNECTED) {
      router.push(`/${session?.did.parent}`);
    }
  }, [status]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.log(err);
    }
  };

  return <LandingSection first>
    <FlexRow align={"center"} fullWidth justify={"between"} >
      <Col sm={12} md={6} >
        <Flex flexDirection={"column"} justifyContent={"left"} className={cc([" lnd-card lnd-first", cm.container])}>
          <Header className={cm.lndBlueTtl}> The human bridge between context and content</Header>
          <Text style={{ fontSize: "2.4rem", lineHeight: "1.50" }} className={cc([cm.descLine, "mr-lg-10 pr-lg-10 mb-6", "mb-sm-7"])}>
            Index Network helps you to create composable discovery engines.</Text>
          <Button
            theme="primary"
            onClick={handleConnect}
          >Connect Wallet</Button>
        </Flex>
      </Col>
      <Col sm={12} md={6}>
        <Flex justifyContent={"right"}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={cm.video}
            style={{

            }}
          >
            <source src="/video/mainani-white.webm" type="video/mp4" />
          </video>
        </Flex>
      </Col>
    </FlexRow>
  </LandingSection>;
};

export default LandingSection1;

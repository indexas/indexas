import Freizeit from "@/fonts/loader";
import Header from "components/base/Header";
import Modal from "components/base/Modal";
import Text from "components/base/Text";
import Flex from "components/layout/base/Grid/Flex";
import Row from "components/layout/base/Grid/Row";

const ConfirmTransaction = ({
  handleCancel,
  backdropClose,
  ...modalProps
}: any) => {
  const handleClose = () => {
    modalProps.onClose?.();
  };
  return (
    <Modal
      {...modalProps}
      size={"fit"}
      destroyOnClose
      backdropClose={backdropClose}
      body={
        <>
          <Row></Row>
          <Flex
            alignitems="center"
            style={{
              paddingBottom: "2.4rem",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className={"p-0"}
              style={{
                width: "60%",
                margin: "auto",
              }}
            >
              <source src="/video/loadingPerspective.mp4" type="video/mp4" />
            </video>
          </Flex>
        </>
      }
      header={
        <>
          <Header className={Freizeit.className} level={2}>
            Waiting for network confirmation
          </Header>
          <Text className={"mt-4"} element={"p"}>
            Please wait for a few seconds.
          </Text>
        </>
      }
      // footer={
      //   <>
      //     <Row>
      //       <Col pullLeft>
      //         <Button
      //           onClick={handleCancel}
      //           className="pl-8 pr-8 "
      //           size="lg"
      //           theme="clear"
      //         >
      //           Cancel
      //         </Button>
      //       </Col>
      //       <Col pullRight>
      //         <Button
      //           theme="primary"
      //           size="lg"
      //           className="pl-6 pr-6"
      //           loading={true}
      //           disabled={true}
      //         >
      //           Loading
      //         </Button>
      //       </Col>
      //     </Row>
      //   </>
      // }
    ></Modal>
  );
};

export default ConfirmTransaction;

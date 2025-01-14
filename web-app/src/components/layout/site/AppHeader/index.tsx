import Spin from "@/components/base/Spin";
import WaitBetaModal from "@/components/site/modal/WaitBetaModal";
import { useApp } from "@/context/AppContext";
import { AuthStatus, useAuth } from "@/context/AuthContext";
import { useRouteParams } from "@/hooks/useRouteParams";
import { selectDID } from "@/store/slices/didSlice";
import { useAppSelector } from "@/store/store";
import Avatar from "components/base/Avatar";
import Button from "components/base/Button";
import Dropdown from "components/base/Dropdown";
import DropdownMenuItem from "components/base/Dropdown/DropdownMenuItem";
import IconDisconnect from "components/base/Icon/IconDisconnect";
import IconHistory from "components/base/Icon/IconHistory";
import IconSettings from "components/base/Icon/IconSettings";
import Text from "components/base/Text";
import Navbar, { NavbarMenu } from "components/layout/base/Navbar";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const AppHeader = () => {
  const { connect, disconnect, status, setStatus, session } = useAuth();
  const router = useRouter();
  const { isLanding } = useRouteParams();
  const [modalVisible, setModalVisible] = useState(false);
  const {
    setCreateModalVisible,
    rightSidebarOpen,
    setRightSidebarOpen,
    setEditProfileModalVisible,
    setGuestModalVisible,
  } = useApp();

  const { userProfile } = useAppSelector(selectDID);

  const handleDisconnect = useCallback(async () => {
    try {
      disconnect();
      setStatus(AuthStatus.DISCONNECTED);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }, [disconnect, setStatus, router]);

  const handleConnect = useCallback(async () => {
    try {
      await connect();
    } catch (err) {
      console.log(err);
    }
  }, [connect]);

  const handleCreateIndex = useCallback(() => {
    if (window !== undefined) {
      const allowed = localStorage.getItem("allowed");

      console.log("allowed", allowed);
      if (!allowed) {
        setGuestModalVisible(true);
      } else {
        setCreateModalVisible(true);
      }
    }
  }, [setCreateModalVisible]);

  if (isLanding) {
    return (
      <Navbar logoSize="full" className="site-navbar">
        <NavbarMenu placement="right">
          {status !== AuthStatus.CONNECTED && (
            <Button theme="primary" onClick={handleConnect}>
              Connect Wallet
            </Button>
          )}
        </NavbarMenu>
      </Navbar>
    );
  }

  if (status !== AuthStatus.CONNECTED) {
    return (
      <>
        {modalVisible && (
          <WaitBetaModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        )}
        <Navbar logoSize="mini" className="site-navbar">
          <NavbarMenu placement="right">
            {status === AuthStatus.LOADING ? (
              <div
                style={{
                  background: "var(--gray-6)",
                  padding: ".5em 1em",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    paddingLeft: ".5em",
                    paddingRight: "1em",
                  }}
                >
                  <Spin active={true} thickness="light" theme="secondary" />
                </div>
                <p
                  style={{
                    padding: "0",
                    margin: "0",
                    color: "#fff",
                  }}
                >
                  Connecting...
                </p>
              </div>
            ) : (
              <Button theme="primary" onClick={handleConnect}>
                Connect Wallet
              </Button>
            )}
          </NavbarMenu>
        </Navbar>
      </>
    );
  }

  return (
    <Navbar className="site-navbar">
      <NavbarMenu>
        <div className={"navbar-sidebar-handlers mr-3"}>
          <Button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            iconButton
            theme="clear"
          >
            <IconHistory width={32} />
          </Button>
        </div>
        <Button
          style={{ height: "32px" }}
          className="pl-5 pr-5"
          onClick={handleCreateIndex}
          theme="primary"
        >
          New Index
        </Button>
        <Dropdown
          dropdownClass="ml-3"
          position="bottom-right"
          menuItems={
            <>
              <DropdownMenuItem
                onClick={() => {
                  setEditProfileModalVisible(true);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <IconSettings width={16} height="100%" />
                  <Text className="ml-3" element="span" size="md">
                    Profile Settings
                  </Text>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem divider />
              <DropdownMenuItem onClick={handleDisconnect}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <IconDisconnect
                    className="icon-error"
                    width={16}
                    height="100%"
                  />
                  <Text
                    className="dropdown-text-logout ml-3"
                    element="span"
                    size="md"
                    theme="error"
                  >
                    Disconnect
                  </Text>
                </div>
              </DropdownMenuItem>
            </>
          }
        >
          <div>
            <Avatar
              size={32}
              user={userProfile}
              className="site-navbar__avatar"
              hoverable
            />
          </div>
        </Dropdown>
      </NavbarMenu>
    </Navbar>
  );
};

export default AppHeader;

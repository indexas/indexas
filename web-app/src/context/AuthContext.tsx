"use client";

import { WALLET_CONNECTED, trackEvent } from "@/services/tracker";
import { normalizeAccountId } from "@ceramicnetwork/common";
import { Cacao, SiweMessage } from "@didtools/cacao";
import { getAccountId } from "@didtools/pkh-ethereum";
import { getAddress } from "@ethersproject/address";
import { randomBytes, randomString } from "@stablelib/random";
import { DIDSession, createDIDCacao, createDIDKey } from "did-session";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSDK } from "@metamask/sdk-react";

export enum AuthStatus {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  LOADING = "LOADING",
  FAILED = "FAILED",
  IDLE = "IDLE",
  NOT_CONNECTED = "NOT_CONNECTED",
}

export interface AuthContextType {
  connect(): Promise<void>;
  disconnect(): void;
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
  session?: DIDSession;
  setSession: (session: DIDSession) => void;
  userDID?: string;
  isLoading?: boolean;
}

const defaultAuthContext = {
  connect: async () => {},
  disconnect: () => {},
  status: AuthStatus.IDLE,
  setStatus: () => {},
  session: undefined,
  setSession: () => {},
  userDID: undefined,
  isLoading: false,
};

/* eslint-disable */
export const AuthContext =
  React.createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: any) => {
  const SESSION_KEY = "did";

  const { provider: ethProvider, sdk } = useSDK();


  const [session, setSession] = useState<DIDSession | undefined>();
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.IDLE);

  const userDID = session?.did.parent;
  const isLoading = status === AuthStatus.LOADING;

  const handleInitialCheck = useCallback(async () => {
    const res = await checkSession();
    console.log("Check session result", res);
  }, []);

  useEffect(() => {
    handleInitialCheck();
  }, [handleInitialCheck]);

  const disconnect = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(undefined);
  }, []);

  const checkSession = useCallback(async (): Promise<boolean> => {
    if (session && session?.isExpired) {
      setStatus(AuthStatus.CONNECTED);
      return true;
    }

    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) {
      setStatus(AuthStatus.NOT_CONNECTED);
      return false;
    }

    const existingSession = await DIDSession.fromSession(sessionStr);
    setSession(existingSession);
    setStatus(AuthStatus.CONNECTED);
    return !existingSession.isExpired;
  }, [session]);

  const startSession = useCallback(async (): Promise<boolean> => {
    
    if (!ethProvider) {
      return false
    }

    try {
      const accounts = await sdk?.connect();

      const accountId = await getAccountId(ethProvider, accounts?.[0]);
      const normAccount = normalizeAccountId(accountId);
      const keySeed = randomBytes(32);
      const didKey = await createDIDKey(keySeed);
      console.log(didKey)
      const now = new Date();
      const twentyFiveDaysLater = new Date(
        now.getTime() + 365 * 24 * 60 * 60 * 1000,
      );

      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: getAddress(normAccount.address),
        statement: "Give this application access to some of your data on Ceramic",
        uri: didKey.id,
        version: "1",
        chainId: "1",
        nonce: randomString(10),
        issuedAt: now.toISOString(),
        expirationTime: twentyFiveDaysLater.toISOString(),
        resources: ["ceramic://*"],
      });

      const signature =  await ethProvider.request({
        method: "personal_sign",
        params: [siweMessage.signMessage(), getAddress(accountId.address)],
      });
      if (signature === null) {
        throw new Error("Failed to sign message");
      }

      siweMessage.signature = signature as string
      const cacao = Cacao.fromSiweMessage(siweMessage);
      const did = await createDIDCacao(didKey, cacao);
      const newSession = new DIDSession({ cacao, keySeed, did });

      localStorage.setItem(SESSION_KEY, newSession.serialize());
      setSession(newSession);
      return true
    } catch (error) {
      console.error("Error starting session:", error);
      return false;
    }
  }, [ethProvider]);

  const authenticate = useCallback(async () => {
    
    if (!ethProvider) {
      console.warn(
        "Skipping wallet connection: No injected Ethereum provider found.",
      );
      return;
    }

    if (status === AuthStatus.CONNECTED || status === AuthStatus.LOADING) {
      console.log("Already connected or connecting...", status);
      return;
    }

    setStatus(AuthStatus.LOADING);
    try {
      const sessionIsValid = await checkSession();

      if (!sessionIsValid) {
        console.log("No valid session found, starting new session...");
        const sessionResponse = await startSession();
        if (sessionResponse) {
          console.log("Session is valid, connecting...");

          setStatus(AuthStatus.CONNECTED);
          toast.success("Successfully connected to your wallet.");
          trackEvent(WALLET_CONNECTED);
        }else {
          console.error("Error during authentication process");
          setStatus(AuthStatus.FAILED);
        }
      }


    } catch (err) {
      console.error("Error during authentication process:", err);
      setStatus(AuthStatus.FAILED);
      toast.error("Failed to connect to your wallet. Please try again.");
    }
  }, [ethProvider, status, checkSession, startSession]);

  return (
    <AuthContext.Provider
      value={{
        connect: authenticate,
        disconnect,
        status,
        setStatus,
        session,
        setSession,
        userDID,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

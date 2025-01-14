import dotenv from "dotenv";

// Load environment variables in non-production environments
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import { Wallet, ethers } from "ethers";
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import {
  LitPKPResource,
  LitActionResource,
  generateAuthSig,
  createSiweMessageWithRecaps,
} from "@lit-protocol/auth-helpers";
import { LitAbility } from "@lit-protocol/types";

import { DIDSession, createDIDCacao, createDIDKey } from "did-session";
import { Cacao, SiweMessage } from "@didtools/cacao";
import { randomBytes, randomString } from "@stablelib/random";

import RedisClient from "../clients/redis.js";
import { fetchModelInfo, generateLITAction } from "../utils/helpers.js";

// Configuration
const config = {
  litNetwork: process.env.LIT_NETWORK,
  domain: process.env.DOMAIN,
  daysUntilUTCMidnightExpiration: 30,
  requestsPerSecond: 100,
  checkNodeAttestation: false,
  debug: true, //!!process.env.DEBUG || false,
};

// Global instances
const redis = RedisClient.getInstance();
const ethProvider = new ethers.providers.JsonRpcProvider(
  process.env.LIT_PROTOCOL_RPC_PROVIDER,
);
const indexerWallet = new ethers.Wallet(
  process.env.INDEXER_WALLET_PRIVATE_KEY,
  ethProvider,
);

console.log(`Wallet address: ${indexerWallet.address}`);
const litContracts = new LitContracts({
  network: config.litNetwork,
  privateKey: indexerWallet.privateKey,
});
const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
  litNetwork: config.litNetwork,
  checkNodeAttestation: config.checkNodeAttestation,
  debug: config.debug,
});

const thirtyDaysLater = new Date(
  Date.now() + 1000 * 60 * 60 * 24 * config.daysUntilUTCMidnightExpiration,
);

async function debugToken() {
  const tidi =
    "34377241974961642340404714166684286561436613709573157488149117101353173877163";
  await litContracts.connect();
  const authMethods =
    await litContracts.pkpPermissionsContract.read.getPermittedAuthMethods(
      tidi,
    );

  var buffer = Buffer.from("QmTWwFrDoVRgxNS6dfYjzquLu5etLDS5VgAe4e3ET332so");
  var hex = buffer.toString("hex");
  console.log(hex);

  const isPermittedAction =
    await litContracts.pkpPermissionsContractUtils.read.isPermittedAction(
      tidi,
      "QmTWwFrDoVRgxNS6dfYjzquLu5etLDS5VgAe4e3ET332so",
    );
  console.log("lit.authMethods", isPermittedAction);
  const scopes =
    await litContracts.pkpPermissionsContract.read.getPermittedAuthMethodScopes(
      tidi,
      authMethods[1].authMethodType,
      authMethods[1].id,
      3,
    );
  console.log("lit.scopes", scopes);
}

// Functions
async function mintNewCapacityToken() {
  console.log("Minting new capacity token...");
  const { capacityTokenIdStr } = await litContracts.mintCapacityCreditsNFT({
    requestsPerSecond: config.requestsPerSecond,
    daysUntilUTCMidnightExpiration: config.daysUntilUTCMidnightExpiration,
  });
  console.log(`New capacity token minted: ${capacityTokenIdStr}`);
  return capacityTokenIdStr;
}

async function generateAndStoreAuthSigs(capacityTokenId) {
  console.log("Generating and storing authorization signatures...");
  const { capacityDelegationAuthSig } =
    await litNodeClient.createCapacityDelegationAuthSig({
      dAppOwnerWallet: indexerWallet,
      delegateeAddresses: [indexerWallet.address],
      capacityTokenId: capacityTokenId,
      expiration: thirtyDaysLater.toISOString(),
    });

  const latestBlockhash = await litNodeClient.getLatestBlockhash();
  console.log("latestBlockhash:", latestBlockhash);

  const dAppSessionSigs = await litNodeClient.getSessionSigs({
    expiration: thirtyDaysLater.toISOString(),
    chain: "ethereum",
    resourceAbilityRequests: [
      { resource: new LitPKPResource("*"), ability: LitAbility.PKPSigning },
      {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback: async (params) => {
      if (!params.uri) {
        throw new Error("uri is required");
      }
      if (!params.expiration) {
        throw new Error("expiration is required");
      }

      if (!params.resourceAbilityRequests) {
        throw new Error("resourceAbilityRequests is required");
      }

      const toSign = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress: indexerWallet.address,
        nonce: latestBlockhash,
        litNodeClient,
      });

      const authSig = await generateAuthSig({
        signer: indexerWallet,
        toSign,
      });

      return authSig;
    },
    capacityDelegationAuthSig,
  });

  await redis.set(`lit:${config.litNetwork}:capacityTokenId`, capacityTokenId);
  await redis.set(
    `lit:${config.litNetwork}:capacityDelegationAuthSig`,
    JSON.stringify(capacityDelegationAuthSig),
  );
  await redis.set(
    `lit:${config.litNetwork}:dAppSessionSigs`,
    JSON.stringify(dAppSessionSigs),
  );

  console.log("Authorization signatures generated and stored.");
}

async function scheduleTokenRefresh() {
  console.log("Starting token refresh schedule...");
  let refresh = false;
  try {
    const capacityTokenId = await redis.get(
      `lit:${config.litNetwork}:capacityTokenId`,
    );

    if (!capacityTokenId) {
      refresh = true;
    } else {
      const capacity =
        await litContracts.rateLimitNftContractUtils.read.getCapacityByIndex(
          capacityTokenId,
        );
      console.log(
        `Current capacity at token ${capacityTokenId}: ${JSON.stringify(capacity)}`,
      );

      const expiresIn = capacity.expiresAt.timestamp * 1000 - Date.now();
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      if (expiresIn <= twoDaysInMs) {
        refresh = true;
      }
    }

    if (refresh) {
      console.log(
        "Capacity token is close to expiration. Minting a new one...",
      );
      const newTokenId = await mintNewCapacityToken();
      await generateAndStoreAuthSigs(newTokenId);
      console.log("New capacity token is minted and authorized successfully.");
    } else {
      console.log("Current capacity token is still valid. No action needed.");
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function generateDefaultLitActions() {
  const wallet = new Wallet(process.env.INDEXER_WALLET_PRIVATE_KEY);

  const defaultConditions = [
    {
      tag: "semanticIndex",
      value: {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: wallet.address,
        },
      },
    },
  ];

  let { runtimeDefinition } = await fetchModelInfo();
  const defaultCID = await generateLITAction(
    defaultConditions,
    runtimeDefinition,
  );
  console.log("Default CID", defaultCID);
}

async function refreshIndexerDIDSession() {
  const keySeed = randomBytes(32);
  const didKey = await createDIDKey(keySeed);

  const now = new Date();

  const siweMessage = new SiweMessage({
    domain: process.env.DOMAIN,
    address: indexerWallet.address,
    statement: "Give this application access to some of your data on Ceramic",
    uri: didKey.id,
    version: "1",
    chainId: "1",
    nonce: randomString(10),
    issuedAt: now.toISOString(),
    expirationTime: thirtyDaysLater.toISOString(),
    resources: ["ceramic://*"],
  });

  siweMessage.signature = await indexerWallet.signMessage(
    siweMessage.toMessage(),
  );

  const cacao = Cacao.fromSiweMessage(siweMessage);
  const did = await createDIDCacao(didKey, cacao);
  const newSession = new DIDSession({ cacao, keySeed, did });
  await redis.set(`agent:did:session`, newSession.serialize());
  console.log("New DID Session for indexer saved to Redis");
}

async function run() {
  await redis.connect();
  await litNodeClient.connect();
  await litContracts.connect();

  await refreshIndexerDIDSession();
  //await scheduleTokenRefresh();
  process.exit(0);
}

run();

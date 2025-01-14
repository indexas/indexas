import { SiweMessage } from "@didtools/cacao";
import { getAddress } from "@ethersproject/address";
import moment from "moment";
import fs from "fs/promises";

import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

// import pinataSDK from "@pinata/sdk";

//import { Readable } from "stream";

import RedisClient from "../clients/redis.js";

const redis = RedisClient.getInstance();

export const fetchModelInfo = async () => {
  try {
    const modelInfo = await fetch(`${process.env.API_HOST}/model/info`);
    return modelInfo.json();
  } catch (e) {
    console.error("Error fetching model info", e);
    process.exit(0);
  }
};

export const getCurrentDateTime = () => moment.utc().toISOString();

export const getAuthSigFromDIDSession = (session) => {
  return {
    signedMessage: SiweMessage.fromCacao(session.cacao).toMessage(),
    address: getAddress(session.did.parent.split(":").pop()),
    derivedVia: "web3.eth.personal.sign",
    sig: session.cacao.s.s,
  };
};

export const removePrefixFromKeys = (obj, prefix) =>
  Object.keys(obj).reduce(
    (newObj, key) => ({
      ...newObj,
      [key.startsWith(prefix) ? key.slice(prefix.length) : key]: obj[key],
    }),
    {},
  );

export const generateLITAction = async (conditions, definition) => {
  let actionStr = await fs.readFile(`src/types/template-lit-action.js`, "utf8");

  actionStr = actionStr.replace(
    "__REPLACE_THIS_AS_CONDITIONS_ARRAY__",
    JSON.stringify(conditions),
  );

  const models = JSON.stringify({
    Index: definition.models.Index.id,
    IndexItem: definition.models.IndexItem.id,
    Embedding: definition.models.Embedding.id,
  });

  actionStr = actionStr.replace("__REPLACE_THIS_AS_MODELS_OBJECT__", models);
  /*
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT_KEY });

  const buffer = Buffer.from(actionStr, "utf8");
  const stream = Readable.from(buffer);

  stream.path = "string.txt";

  const resp = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: { name: "signerFunction" },
  });
  return resp.IpfsHash;
   */
};

export const flattenSources = async (sources, didService) => {
  const sourcePromises = sources.map(async (source) => {
    if (source.includes("did:")) {
      // TODO: check better
      const did = source.split("/")[0];

      let type;
      if (source.includes("/index/starred")) {
        type = "starred";
      } else if (source.includes("/index/owned")) {
        type = "owned";
      }

      return didService
        .getIndexes(did, type)
        .then((indexes) => indexes.map((i) => i.id));
    } else {
      const result = [source];
      const subIndexes = await redis.hKeys(`index:${source}:subIndexes`);
      if (subIndexes.length > 0) {
        result.push(...subIndexes);
      }
      return Promise.resolve(result);
    }
  });

  const results = await Promise.all(sourcePromises);
  return results.flat();
};

export const getAgentDID = async () => {
  const indexerWalletPrivateKey = process.env.INDEXER_WALLET_PRIVATE_KEY;
  if (!indexerWalletPrivateKey) {
    return false;
  }
  const key = fromString(indexerWalletPrivateKey, "base16");
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key),
  });
  await did.authenticate();
  if (!did.authenticated) {
    return false;
  }
  return did;
};

export const decryptJWE = async (did, str) => {
  try {
    const parsedStr = JSON.parse(str.replace(/`/g, '"'));
    const decryptedData = await did.decryptDagJWE(parsedStr);
    return decryptedData;
  } catch (error) {
    console.error("Failed to decrypt JWE:", error.message);
  }
};
export const createDagJWE = async (owner, dids, cleartext) => {
  try {
    const jwe = await owner.createDagJWE(cleartext, dids);
    const stringified = JSON.stringify(jwe).replace(/"/g, "`");
    return stringified;
  } catch (error) {
    console.error("Failed to create JWE:", error);
    throw new Error("Encryption failed. Please check the input and try again.");
  }
};

import dotenv from "dotenv";
import axios from "axios";
import { ItemService } from "../services/item.js";
import { ComposeDBService } from "../services/composedb.js";
import { EmbeddingService } from "../services/embedding.js";
import { getPKPSessionForIndexer } from "../libs/lit/index.js";
import RedisClient from "../clients/redis.js";
import { CeramicClient } from "@ceramicnetwork/http-client";

import { ethers } from "ethers";

import Logger from "../utils/logger.js";

const logger = Logger.getInstance();

const redis = RedisClient.getInstance();
const ceramic = new CeramicClient(process.env.CERAMIC_HOST);

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

class Indexer {
  constructor(definition, fragments) {
    this.definition = definition;
    this.fragments = fragments;
  }
  // Index Item (C)
  async createIndexItemEvent(id) {
    logger.info(`Step [0]: createIndexItemEvent trigger for id: ${id}`);

    const itemService = new ItemService(this.definition);
    const indexItem = await itemService.getIndexItemById(id, false);

    logger.info(
      `Step [0]: IndexItem found for id: ${JSON.stringify(indexItem)}`,
    );

    try {
      const indexSession = await getPKPSessionForIndexer(indexItem.index);
      await indexSession.did.authenticate();

      logger.info(
        "Step [0]: Indexer session created for index:",
        indexItem.index.id,
      );

      // Check if the item is a webpage and has no content then return Exception
      if (
        indexItem.item.__typename === "WebPage" &&
        indexItem.item.WebPage_content === ""
      ) {
        logger.warn(
          "Step [0]: No content found, createIndexItem event incomplete",
        );
        return;
      }

      if (indexItem.item.__typename === "Index") {
        await redis.hSet(
          `index:${indexItem.indexId}:subIndexes`,
          indexItem.itemId,
          1,
        );
        // Todo update this when ceramic announces easy model upgrades. Or write a bulk update for IndexItem model.
        // We can do that anon. Very easy. We should just replace indexitem model but not embeddings and index.
        logger.info(
          "Step [0]: Do not create embeddings for index model. Just cache it.",
        );
        return;
      }

      const embeddingResponse = await axios.post(
        `${process.env.LLM_INDEXER_HOST}/indexer/embeddings`,
        {
          content: indexItem.item.content ?? JSON.stringify(indexItem.item),
        },
      );

      const embeddingService = new EmbeddingService(this.definition).setSession(
        indexSession,
      );
      const embedding = await embeddingService.createEmbedding({
        indexId: indexItem.indexId,
        itemId: indexItem.itemId,
        modelName: embeddingResponse.data.model,
        category: "document",
        vector: embeddingResponse.data.vector,
        description: "Default document embeddings",
      });

      logger.info(
        `Step [0]: EmbeddingEvent trigger successful for id: ${embedding.id}`,
      );
    } catch (e) {
      logger.error(
        `Step [0]: Indexer createIndexItemEvent error: ${JSON.stringify(e)}`,
      );
    }
  }
  // Index item (UD)
  async updateIndexItemEvent(id) {
    logger.info(`Step [1]: UpdateIndexItemEvent trigger for id: ${id}`);

    const itemService = new ItemService(this.definition);
    const indexItem = await itemService.getIndexItemById(id, false);

    try {
      const indexSession = await getPKPSessionForIndexer(indexItem.index);
      await indexSession.did.authenticate();

      logger.info(
        `Step [1]: Indexer session created for index: ${indexItem.index.id}`,
      );

      const updateURL = `${process.env.LLM_INDEXER_HOST}/indexer/item?indexId=${indexItem.indexId}&indexItemId=${indexItem.itemId}`;

      if (indexItem.deletedAt !== null) {
        logger.info(`Step [1]: IndexItem DeleteEvent trigger for id: ${id}`);

        const deleteResponse = await axios.delete(updateURL);

        // logger.info("IndexItem Delete Response", deleteResponse)

        if (deleteResponse.status === 200) {
          logger.info(`Step [1]: IndexItem Delete Success for id: ${id}`);
        } else {
          logger.debug(`Step [1]: IndexItem Delete Failed for id: ${id}`);
        }
      }
    } catch (e) {
      logger.error(
        `Step [1]: Indexer updateIndexItemEvent with error: ${JSON.stringify(e.message)}`,
      );
    }
  }

  async updateQuestions(indexItem) {
    try {
      let response = await axios.get(
        `${process.env.LLM_INDEXER_HOST}/chat/questions`,
        {
          indexIds: [indexItem.index.id],
        },
      );
      const sourcesHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(JSON.stringify([indexItem.index.id])),
      );

      await redis.set(
        `questions:${sourcesHash}`,
        JSON.stringify(response.data),
        "EX",
        86400,
      );
    } catch (error) {
      console.error("Error fetching or caching data:", error);
    }
  }

  async updateWebPageEvent(id) {
    logger.info(`Step [2]: UpdateWebPageEvent trigger for id: ${id}`);

    const webPageFragment = this.fragments.filter(
      (fragment) => fragment.name === "WebPage",
    )[0];

    const composeDBService = new ComposeDBService(
      this.definition,
      webPageFragment,
    );
    const webPageItem = await composeDBService.getNodeById(id);

    try {
      if (webPageItem && webPageItem.content) {
        const itemSession = new ItemService(this.definition);
        const indexItems = await itemSession.getIndexesByItemId(
          webPageItem.id,
          null,
          24,
          false,
        );

        for (let indexItem of indexItems.items) {
          logger.info(
            `Step [2]: IndexItem UpdateEvent trigger for id: ${indexItem.id}`,
          );

          const indexSession = await getPKPSessionForIndexer(indexItem.index);

          const embeddingService = new EmbeddingService(
            this.definition,
          ).setSession(indexSession);

          const embeddingResponse = await axios.post(
            `${process.env.LLM_INDEXER_HOST}/indexer/embeddings`,
            {
              content: webPageItem.content,
            },
          );

          logger.info(
            `Step [2]: Embedding created for indexItem: ${indexItem.id} with vector length ${embeddingResponse.data.vector?.length}`,
          );

          const embedding = await embeddingService.createEmbedding({
            indexId: indexItem.index.id,
            itemId: indexItem.item.id,
            modelName: embeddingResponse.data.model,
            category: "document",
            vector: embeddingResponse.data.vector,
            description: "Default document embeddings",
          });

          //this.updateQuestions(indexItem);
          logger.info(
            `Step [2]: EmbeddingEvent trigger successfull for id: ${embedding.id}`,
          );
        }
      }
    } catch (e) {
      logger.error(
        `Step [2]: Indexer updateWebPageEvent with error: ${JSON.stringify(e.message)}`,
      );
    }
  }

  async createEmbeddingEvent(id) {
    logger.info(`Step [3]: createEmbeddingEvent trigger for id: ${id}`);

    const embeddingService = new EmbeddingService(this.definition);
    const embedding = await embeddingService.getEmbeddingById(id);
    const stream = await ceramic.loadStream(embedding.item.id);

    const doc = {
      ...stream.content,
      id: stream.id.toString(),
      controllerDID: stream.metadata.controller,
      modelName: embedding.item.__typename,
    };
    console.log(doc);
    const payload = {
      indexId: embedding.index.id,
      indexTitle: embedding.index.title,
      indexCreatedAt: embedding.index.createdAt,
      indexUpdatedAt: embedding.index.updatedAt,
      indexDeletedAt: embedding.index.deletedAt,
      indexOwnerDID: embedding.index.ownerDID.id,
      vector: embedding.vector,
    };

    for (let key of Object.keys(doc)) {
      payload[key] = doc[key];
    }

    if (embedding.index.ownerDID.name) {
      payload.indexOwnerName = embedding.index.ownerDID.name;
    }
    if (embedding.index.ownerDID.bio) {
      payload.indexOwnerBio = embedding.index.ownerDID.bio;
    }

    try {
      const indexResponse = await axios.post(
        `${process.env.LLM_INDEXER_HOST}/indexer/index?indexId=${embedding.index.id}`,
        payload,
      );
      logger.info(
        `Step [3]: Index ${embedding.indexId} with Item ${embedding.itemId} indexed with it's content and embeddings`,
      );
    } catch (e) {
      logger.error(
        `Step [3]: Indexer createEmbeddingEvent with error: ${JSON.stringify(e)}`,
      );
    }
  }

  async updateEmbeddingEvent(id) {
    logger.info("updateEmbeddingEvent", id);
  }
}

export default Indexer;
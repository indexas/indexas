import { ComposeClient } from "@composedb/client";
import { removePrefixFromKeys, getCurrentDateTime } from "../utils/helpers.js";
import { indexItemFragment } from "../types/fragments.js";
import { IndexService } from "./index.js";

const transformIndexItem = (indexItem) => {
  const { __typename: type, indexedAt: _, ...rest } = indexItem.item;
  return {
    type,
    node: {
      ...rest,
      // indexedAt: indexItem.updatedAt
    },
  };
};

export class ItemService {
  constructor(definition) {
    this.client = new ComposeClient({
      ceramic: process.env.CERAMIC_HOST,
      definition,
    });
    this.did = null;
    this.indexService = new IndexService(definition);
  }

  setSession(session) {
    if (session && session.did.authenticated) {
      this.did = session.did;
    }
    return this;
  }

  async getIndexItem(indexId, itemId, transformation = true) {
    try {
      const index = await this.indexService.getIndexById(indexId);

      let { data, errors } = await this.client.executeQuery(`
        {
          node(id: "${index.id}") {
            ... on Index {
              items(
                first: 1
                account: "${index.controllerDID.id}"
                filters: {
                  where: {
                    deletedAt: {isNull: true}
                    itemId: {equalTo: "${itemId}"}
                  }
                }
                sorting: { createdAt: DESC}
              ) {
                edges {
                  node {
                    ${indexItemFragment}
                  }
                }
              }
            }
          }
          }
        `);

      // Handle GraphQL errors
      if (errors) {
        throw new Error(`Error getting index item: ${JSON.stringify(errors)}`);
      }
      // Validate the data response
      if (!data || !data.node || !data.node.items || !data.node.items.edges) {
        throw new Error("Invalid response data");
      }

      const items = data.node.items.edges;

      if (items.length === 0) {
        return null;
      }

      let item = items[0];
      item.node = removePrefixFromKeys(item.node, `${item.node.__typename}_`);
      return transformation ? transformIndexItem(item.node) : item.node;
    } catch (error) {
      // Log the error and rethrow it for external handling
      console.error("Exception occurred in getIndexItem:", error);
      throw error;
    }
  }

  // Todo make it multimodel later.
  async getIndexItemById(indexItemId, transformation = true) {
    try {
      let { data, errors } = await this.client.executeQuery(`
            {
              node(id: "${indexItemId}") {
                ${indexItemFragment}
              }
            }`);

      // Handle GraphQL errors
      if (errors) {
        throw new Error(`Error getting index item: ${JSON.stringify(errors)}`);
      }
      // Validate the data response
      if (!data || !data.node) {
        throw new Error("Invalid response data");
      }

      data.node.item = removePrefixFromKeys(
        data.node.item,
        `${data.node.item.__typename}_`,
      );

      return transformation ? transformIndexItem(data.node) : data.node;
    } catch (error) {
      // Log the error and rethrow it for external handling
      console.error("Exception occurred in getIndexItemById:", error);
      throw error;
    }
  }

  async getIndexItems(indexId, cursor = null, limit = 24) {
    try {
      let cursorFilter = cursor ? `after: "${cursor}",` : "";
      const index = await this.indexService.getIndexById(indexId);

      let { data, errors } = await this.client.executeQuery(`{
        node(id: "${indexId}") {
          ... on Index {
            items(
              first: 10
              ${cursorFilter}
              account: "${index.controllerDID.id}"
              filters: {
                where: {
                  deletedAt: {isNull: true}
                }
              }
              sorting: { createdAt: DESC}
            ) {
              pageInfo {
                endCursor
              }
              edges {
                node {
                  ${indexItemFragment}
                }
              }
            }
          }
        }
        }`);

      // Handle GraphQL errors
      if (errors) {
        throw new Error(`Error getting index item: ${JSON.stringify(errors)}`);
      }
      // Validate the data response
      if (!data || !data.node || !data.node.items || !data.node.items.edges) {
        throw new Error("Invalid response data");
      }

      const items = data.node.items.edges;

      if (items.length === 0) {
        return {
          endCursor: null,
          items: [],
        };
      }

      items.map((e) => {
        e.node.item = removePrefixFromKeys(
          e.node.item,
          `${e.node.item.__typename}_`,
        );
        return e;
      });
      return {
        //Todo fix itemId to id
        endCursor: data.node.items.pageInfo.endCursor,
        items: items.map((e) => transformIndexItem(e.node)),
      };
    } catch (error) {
      // Log the error and rethrow it for external handling
      console.error("Exception occurred in getIndexItem:", error);
      throw error;
    }
  }

  async getIndexesByItemId(
    itemId,
    cursor = null,
    limit = 24,
    transform = true,
  ) {
    try {
      let cursorFilter = cursor ? `after: "${cursor}",` : "";

      const { data, errors } = await this.client.executeQuery(`{
              indexItemIndex(first: ${limit}, ${cursorFilter} filters: {
                where: {
                  itemId: { equalTo: "${itemId}"},
                  deletedAt: {isNull: true}
                }
              }, sorting: { createdAt: DESC}) {
                pageInfo {
                  endCursor
                }
                edges {
                  node {
                    ${indexItemFragment}
                  }
                }
              }
            }`);

      // Handle GraphQL errors
      if (errors) {
        throw new Error(`Error getting index item: ${JSON.stringify(errors)}`);
      }
      // Validate the data response
      if (!data || !data.indexItemIndex || !data.indexItemIndex.edges) {
        throw new Error("Invalid response data");
      }

      if (data.indexItemIndex.edges.length === 0) {
        return {
          endCursor: null,
          items: [],
        };
      }
      data.indexItemIndex.edges.map((e) =>
        removePrefixFromKeys(e.node.item, `${e.node.item.__typename}_`),
      );

      return {
        //Todo fix itemId to id
        endCursor: data.indexItemIndex.pageInfo.endCursor,
        items: data.indexItemIndex.edges.map((e) =>
          transform ? transformIndexItem(e.node) : e.node,
        ),
      };
    } catch (error) {
      // Log the error and rethrow it for external handling
      console.error("Exception occurred in getIndexItem:", error);
      throw error;
    }
  }

  async getIndexItemsByIds(itemIds, cursor = null, limit = 240) {
    try {
      let cursorFilter = cursor ? `after: "${cursor}",` : "";

      const { data, errors } = await this.client.executeQuery(`{
              indexItemIndex(first: ${limit}, ${cursorFilter} filters: {
                where: {
                  itemId: { in: ${JSON.stringify(itemIds)}}},
                  deletedAt: {isNull: true}
                }
              }, sorting: { createdAt: DESC}) {
                pageInfo {
                  endCursor
                }
                edges {
                  node {
                    ${indexItemFragment}
                  }
                }
              }
            }`);

      // Handle GraphQL errors
      if (errors) {
        throw new Error(`Error getting index item: ${JSON.stringify(errors)}`);
      }
      // Validate the data response
      if (!data || !data.indexItemIndex || !data.indexItemIndex.edges) {
        throw new Error("Invalid response data");
      }

      if (data.indexItemIndex.edges.length === 0) {
        return {
          endCursor: null,
          items: [],
        };
      }

      data.indexItemIndex.edges.map((e) => {
        e.node.item = removePrefixFromKeys(
          e.node.item,
          `${e.node.item.__typename}_`,
        );
        return e;
      });

      return {
        //Todo fix itemId to id
        endCursor: data.indexItemIndex.pageInfo.endCursor,
        items: data.indexItemIndex.edges.map((e) => transformIndexItem(e.node)),
      };
    } catch (error) {
      // Log the error and rethrow it for external handling
      console.error("Exception occurred in getIndexItem:", error);
      throw error;
    }
  }

  async addItem(indexId, itemId) {
    if (!this.did) {
      throw new Error("DID not set. Use setDID() to set the did.");
    }
    try {
      const indexItem = await this.getIndexItem(indexId, itemId);
      if (indexItem) {
        return indexItem;
      }

      const node = await this.client.context.ceramic.loadStream(itemId);
      const modelId = node.metadata.model;
      //const indexItem = await this.get(indexId, itemId);

      const content = {
        indexId,
        itemId,
        modelId,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      };
      this.client.setDID(this.did);

      const { data, errors } = await this.client.executeQuery(
        `
                mutation CreateIndexItem($input: CreateIndexItemInput!) {
                    createIndexItem(input: $input) {
                        document {
                            ${indexItemFragment}
                        }
                    }
                }`,
        { input: { content } },
      );
      // Handle GraphQL errors
      if (errors) {
        throw new Error(`Error creating item: ${JSON.stringify(errors)}`);
      }

      // Validate the data response

      if (
        !data ||
        !data.createIndexItem ||
        !data.createIndexItem.document ||
        !data.createIndexItem.document.item
      ) {
        throw new Error(["Invalid response data", data]);
      }

      data.createIndexItem.document.item = removePrefixFromKeys(
        data.createIndexItem.document.item,
        `${data.createIndexItem.document.item.__typename}_`,
      );

      return transformIndexItem(data.createIndexItem.document);
    } catch (error) {
      // Log the error and rethrow it for external handling
      console.error("Exception occurred in createIndexItem:", error);
      throw error;
    }
  }

  async removeItem(indexId, itemId) {
    if (!this.did) {
      throw new Error("DID not set. Use setDID() to set the did.");
    }
    try {
      const indexItem = await this.getIndexItem(indexId, itemId, false);

      if (!indexItem) {
        throw new Error("Index item does not exist.");
      }
      if (indexItem.deletedAt) {
        throw new Error("Index item is already deleted.");
      }

      const content = {
        updatedAt: getCurrentDateTime(),
        deletedAt: getCurrentDateTime(),
      };
      this.client.setDID(this.did);

      const { data, errors } = await this.client.executeQuery(
        `
                mutation UpdateIndexItem($input: UpdateIndexItemInput!) {
                    updateIndexItem(input: $input) {
                        document {
                            ${indexItemFragment}
                        }
                    }
                }`,
        { input: { id: indexItem.id, content } },
      );
      // Handle GraphQL errors
      if (errors) {
        throw new Error(`Error updating item: ${JSON.stringify(errors)}`);
      }

      // Validate the data response
      if (!data || !data.updateIndexItem || !data.updateIndexItem.document) {
        throw new Error("Invalid response data");
      }

      return true; //transformIndexItem(data.updateIndexItem.document);;
    } catch (error) {
      // Log the error and rethrow it for external handling
      console.error("Exception occurred in updateIndexItem:", error);
      throw error;
    }
  }
}

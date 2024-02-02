// ApiService.ts

import axios, { AxiosInstance } from "axios";
import { appConfig } from "config";
import { DIDSession } from "did-session";
import { Indexes, Link, Users } from "types/entity";
import { DEFAULT_CREATE_INDEX_TITLE } from "utils/constants";
import litService from "./lit-service";

const API_ENDPOINTS = {
  CHAT_STREAM: "/chat_stream",
  INDEXES: "/indexes/:id",
  GET_ALL_INDEXES: "/dids/:did/indexes",
  CREATE_INDEX: "/indexes",
  UPDATE_INDEX: "/dids/:did/indexes/:indexId",
  STAR_INDEX: "/dids/:did/indexes/:indexId/star",
  OWN_INDEX: "/dids/:did/indexes/:indexId/own",
  GET_PROFILE: "/dids/:did/profile",
  GET_ITEMS: "/indexes/:indexId/items",
  GET_ITEM: "/indexes/:indexId/items/:itemId",
  CREATE_ITEM: "/indexes/:indexId/items/:itemId",
  DELETE_ITEM: "/indexes/:indexId/items/:itemId",
  GET_USER_INDEXES: "/search/user_indexes",
  LIT_ACTIONS: "/lit_actions",
  CRAWL: "/web2/webpage/crawl",
  ADD_INDEX_ITEM: "/items",
  CRAWL_CONTENT: "/links/crawl-content",
  FIND_CONTENT: "/links/find-content",
  SYNC_CONTENT: "/links/sync-content",
  NFT_METADATA: "/nft",
  ENS: "/ens",
  UPLOAD_AVATAR: "/upload_avatar",
  ZAPIER_TEST_LOGIN: "/zapier/test_login",
  SUBSCRIBE_TO_NEWSLETTER: "/subscribe",
};

export interface LitActionConditions {}

class ApiService {
  private static instance: ApiService;
  private apiAxios: AxiosInstance;
  private session: DIDSession | null = null;
  private signerPublicKey: Indexes["signerPublicKey"] | null = null;

  private constructor() {
    this.apiAxios = axios.create({
      baseURL: appConfig.apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setSession(session: DIDSession) {
    // console.log('setSession', session);
    this.session = session;
    this.apiAxios.defaults.headers.Authorization = `Bearer ${session.serialize()}`;
    // debugger;
  }

  public getSession() {
    return this.session;
  }

  setPkpPublicKey(signerPublicKey: Indexes["signerPublicKey"]) {
    this.signerPublicKey = signerPublicKey;
  }

  async getAllIndexes(id: string): Promise<Indexes[]> {
    const url = API_ENDPOINTS.GET_ALL_INDEXES.replace(":did", id);
    const { data } = await this.apiAxios.get<Indexes[]>(url);
    return data;
  }

  async getProfile(did: string): Promise<Users> {
    const url = API_ENDPOINTS.GET_PROFILE.replace(":did", did);
    const { data } = await this.apiAxios.get<Users>(url);
    return data;
  }

  async getIndex(indexId: string): Promise<Indexes | undefined> {
    const url = API_ENDPOINTS.INDEXES.replace(":id", indexId);
    const { data } = await this.apiAxios.get<Indexes>(url);
    return data as Indexes;
  }

  async updateIndex(indexId: string, index: Partial<Indexes>) {
    const url = API_ENDPOINTS.UPDATE_INDEX.replace(":id", indexId);
    const { data } = await this.apiAxios.patch<Indexes>(url, index);
    return data;
  }

  async getLITAction(cid: string): Promise<LitActionConditions | null> {
    try {
      const { data } = await this.apiAxios.get<LitActionConditions>(
        `${API_ENDPOINTS.LIT_ACTIONS}/${cid}`,
      );
      return data;
    } catch (err) {
      return null;
    }
  }

  async postLITAction(conditions: LitActionConditions): Promise<string | null> {
    try {
      const { data } = await this.apiAxios.post<LitActionConditions>(
        `${API_ENDPOINTS.LIT_ACTIONS}`,
        conditions,
      );
      return data as string;
    } catch (err) {
      return null;
    }
  }

  async crawlLink(url: string): Promise<Link> {
    const { data } = await this.apiAxios.post<Link>(API_ENDPOINTS.CRAWL, {
      title: DEFAULT_CREATE_INDEX_TITLE,
      url,
    });
    return data;
  }

  async addIndexItem(indexId: string, itemId: string) {
    const { data } = await this.apiAxios.post(API_ENDPOINTS.ADD_INDEX_ITEM, {
      indexId,
      itemId,
    });
    return data;
  }

  async starIndex(did: string, indexId: string, add: boolean) {
    const url = API_ENDPOINTS.STAR_INDEX.replace(":did", did).replace(
      ":indexId",
      indexId,
    );

    if (add) {
      const { data } = await this.apiAxios.put(url);
      return data;
    } else {
      const { data } = await this.apiAxios.delete(url);
      return data;
    }
  }

  async ownIndex(did: string, indexId: string, add: boolean) {
    const url = API_ENDPOINTS.OWN_INDEX.replace(":did", did).replace(
      ":indexId",
      indexId,
    );

    if (add) {
      const { data } = await this.apiAxios.put(url);
      return data;
    } else {
      const { data } = await this.apiAxios.delete(url);
      return data;
    }
  }

  async getItems(
    indexId: string,
    query: { limit?: number; cursor?: string; query?: string } = {},
  ) {
    let url = API_ENDPOINTS.GET_ITEMS.replace(":indexId", indexId);
    // query = {
    //   cursor: "eyJ0eXBlIjoiY29udGVudCIsImlkIjoia2p6bDZrY3ltN3c4eWE1dGZ4dTk3djEweHNoMWQwNmh6a2h5MGl0ZzQ0ajBrcGxhbWNzMGNjbm51cGE2MGhzIiwidmFsdWUiOnsiY3JlYXRlZEF0IjoiMjAyNC0wMi0wMVQxMjo0NDoyMi40NThaIn19",
    // };
    if (query) {
      let formattedQuery = Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      url = `${url}?${new URLSearchParams(formattedQuery)}`;
    }
    const { data } = await this.apiAxios.get(url);
    return data;
  }

  async getItem(indexId: string, itemId: string) {
    const url = API_ENDPOINTS.GET_ITEM.replace(":indexId", indexId).replace(
      ":itemId",
      itemId,
    );
    const { data } = await this.apiAxios.get(url);
    return data;
  }

  async createItem(indexId: string, itemId: string) {
    const url = API_ENDPOINTS.CREATE_ITEM.replace(":indexId", indexId).replace(
      ":itemId",
      itemId,
    );
    const { data } = await this.apiAxios.post(url);
    return data;
  }

  async deleteItem(indexId: string, itemId: string) {
    const url = API_ENDPOINTS.DELETE_ITEM.replace(":indexId", indexId).replace(
      ":itemId",
      itemId,
    );
    const { data } = await this.apiAxios.delete(url);
    return data;
  }

  // async createIndex(title: string = DEFAULT_CREATE_INDEX_TITLE): Promise<Indexes> {
  //   const body = {
  //     title,
  //     signerPublicKey: this.signerPublicKey,
  //     signerFunction: this.signerFunction,
  //   };

  //   const { data } = await this.apiAxios.post<Indexes>('/indexes', body);
  //   return data;
  // }

  async createIndex(
    title: string = DEFAULT_CREATE_INDEX_TITLE,
  ): Promise<Indexes> {
    const { pkpPublicKey } = await litService.mintPkp();

    const body = {
      title,
      signerPublicKey: pkpPublicKey,
      signerFunction: appConfig.defaultCID,
    };

    const url = API_ENDPOINTS.CREATE_INDEX;

    const { data } = await this.apiAxios.post<Indexes>(url, body);
    return data;
  }
}

export default ApiService;
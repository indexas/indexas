import axios, { AxiosInstance, CancelTokenSource } from "axios";
import { DIDSession } from "did-session";
import { Indexes, Link, Users } from "types/entity";
import { DEFAULT_CREATE_INDEX_TITLE } from "utils/constants";
import { CID } from "multiformats";

const API_ENDPOINTS = {
  CHAT_STREAM: "/chat_stream",
  INDEXES: "/indexes/:id",
  DEFAULT_QUESTIONS_OF_INDEX: "/discovery/questions",
  DISCOVERY_UPDATES: "/discovery/:chatID/updates",
  GET_ALL_INDEXES: "/dids/:did/indexes",
  CREATE_INDEX: "/indexes",
  UPDATE_INDEX: "/indexes/:id",
  STAR_INDEX: "/dids/:did/indexes/:indexId/star",
  OWN_INDEX: "/dids/:did/indexes/:indexId/own",
  GET_PROFILE: "/dids/:did/profile",
  GET_CURRENT_PROFILE: "/profile",
  UPDATE_PROFILE: "/profile",
  UPLOAD_AVATAR: "/profile/upload_avatar",
  GET_ITEMS: "/indexes/:indexId/items",
  GET_ITEM: "/indexes/:indexId/items/:itemId",
  CREATE_ITEM: "/indexes/:indexId/items/:itemId",
  DELETE_ITEM: "/indexes/:indexId/items/:itemId",
  LIT_ACTIONS: "/lit_actions",
  CRAWL: "/web2/webpage/crawl",
  ADD_INDEX_ITEM: "/items",
  NFT_METADATA: "/nft",
  ENS: "/ens",
  ZAPIER_TEST_LOGIN: "/zapier/test_login",
  SUBSCRIBE_TO_NEWSLETTER: "/site/subscribe",
  LIST_CONVERSATIONS: "/conversations",
  CREATE_CONVERSATION: "/conversations",
  GET_CONVERSATION: "/conversations/:conversationId",
  GET_CONVERSATION_WITH_SUMMARY: "/conversations/:conversationId/summary",
  DELETE_CONVERSATION: "/conversations/:conversationId",
  SEND_MESSAGE: "/conversations/:conversationId/messages",
  UPDATE_MESSAGE: "/conversations/:conversationId/messages/:messageId",
};

export interface LitActionConditions {}

export type CreatorAction = {
  cid: string;
};

export type GetItemQueryParams = {
  limit?: number;
  cursor?: string;
  query?: string;
};

export type UserProfileUpdateParams = {
  name?: string;
  bio?: string;
  avatar?: CID;
};

class ApiService {
  private static instance: ApiService;
  private apiAxios: AxiosInstance;
  private session: DIDSession | null = null;

  private constructor() {
    this.apiAxios = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
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
    this.session = session;
    this.apiAxios.defaults.headers.Authorization = `Bearer ${session.serialize()}`;
  }

  public setSessionToken(token: string) {
    this.apiAxios.defaults.headers.Authorization = `Bearer ${token}`;
  }

  public getSession() {
    return this.session;
  }

  async getAllIndexes(did: string): Promise<Indexes[]> {
    const url = API_ENDPOINTS.GET_ALL_INDEXES.replace(":did", did);
    const { data } = await this.apiAxios.get<Indexes[]>(url);
    return data;
  }

  async getProfile(did: string): Promise<Users> {
    const url = API_ENDPOINTS.GET_PROFILE.replace(":did", did);
    const { data } = await this.apiAxios.get<Users>(url);
    return data;
  }

  async getCurrentProfile(): Promise<Users> {
    const url = API_ENDPOINTS.GET_CURRENT_PROFILE;
    const { data } = await this.apiAxios.get<Users>(url);
    return data;
  }

  async updateProfile(params: Partial<Users>): Promise<Users> {
    const url = API_ENDPOINTS.UPDATE_PROFILE;
    const { data } = await this.apiAxios.patch<Users>(url, params);
    return data;
  }

  async uploadAvatar(file: File): Promise<{ cid: CID } | null> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await this.apiAxios.post<{ cid: CID }>(
      API_ENDPOINTS.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  }

  async getIndex(
    indexId: string,
    { cancelSource }: { cancelSource?: CancelTokenSource },
  ): Promise<Indexes | undefined> {
    const url = API_ENDPOINTS.INDEXES.replace(":id", indexId);
    const { data } = await this.apiAxios.get<Indexes>(url, {
      cancelToken: cancelSource?.token,
    });
    return data as Indexes;
  }

  async getDefaultQuestionsOfIndex(sources: string[]): Promise<string[]> {
    const url = API_ENDPOINTS.DEFAULT_QUESTIONS_OF_INDEX;
    const { data } = await this.apiAxios.post<{ questions: string[] }>(url, {
      sources,
    });

    return data.questions;
  }

  async getIndexWithIsCreator(
    indexId: string,
    { cancelSource }: { cancelSource?: CancelTokenSource },
  ): Promise<Indexes | undefined> {
    const url = API_ENDPOINTS.INDEXES.replace(":id", indexId).concat(
      "?roles=true",
    );
    const { data } = await this.apiAxios.get<Indexes>(url, {
      cancelToken: cancelSource?.token,
    });
    return data as Indexes;
  }

  async updateIndex(id: string, index: Partial<Indexes>) {
    const url = API_ENDPOINTS.UPDATE_INDEX.replace(":id", id);
    const { data } = await this.apiAxios.patch<Indexes>(url, index);
    return data;
  }

  async getLITAction(cid: string): Promise<LitActionConditions[]> {
    const { data } = await this.apiAxios.get<LitActionConditions>(
      `${API_ENDPOINTS.LIT_ACTIONS}/${cid}`,
    );
    return data as LitActionConditions[];
  }

  async postLITAction(conditions: LitActionConditions): Promise<CreatorAction> {
    const { data } = await this.apiAxios.post<LitActionConditions>(
      `${API_ENDPOINTS.LIT_ACTIONS}`,
      conditions,
    );
    return data as CreatorAction;
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

  async starIndex(indexId: string, add: boolean) {
    if (!this.session) return;
    const url = API_ENDPOINTS.STAR_INDEX.replace(
      ":did",
      this.session?.did.parent,
    ).replace(":indexId", indexId);

    if (add) {
      const { data } = await this.apiAxios.put(url);
      return data;
    }
    const { data } = await this.apiAxios.delete(url);
    return data;
  }
  async ownIndex(indexId: string, add: boolean) {
    if (!this.session) return;
    const url = API_ENDPOINTS.OWN_INDEX.replace(
      ":did",
      this.session?.did.parent,
    ).replace(":indexId", indexId);

    if (add) {
      const { data } = await this.apiAxios.put(url);
      return data;
    }
    const { data } = await this.apiAxios.delete(url);
    return data;
  }

  async getItems(
    indexId: string,
    {
      queryParams = {},
      cancelSource,
    }: { queryParams: GetItemQueryParams; cancelSource?: CancelTokenSource },
  ) {
    let url = API_ENDPOINTS.GET_ITEMS.replace(":indexId", indexId);
    if (queryParams) {
      const formattedQuery = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      url = `${url}?${new URLSearchParams(formattedQuery)}`;
    }
    const { data } = await this.apiAxios.get(url, {
      cancelToken: cancelSource?.token,
    });
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

  async createIndex(
    title: string = DEFAULT_CREATE_INDEX_TITLE,
  ): Promise<Indexes> {
    const body = {
      title,
    };

    const url = API_ENDPOINTS.CREATE_INDEX;

    const { data } = await this.apiAxios.post<Indexes>(url, body);
    return data;
  }

  async listConversations(): Promise<any> {
    if (!this.session) return;
    const response = await this.apiAxios.get<any>(
      API_ENDPOINTS.LIST_CONVERSATIONS,
    );

    if (response.status !== 200) {
      throw new Error("Failed to list conversations message");
    }

    return response.data;
  }

  async createConversation(params: any): Promise<any> {
    const response = await this.apiAxios.post<any>(
      API_ENDPOINTS.CREATE_CONVERSATION,
      params,
    );

    if (response.status !== 201) {
      throw new Error("Failed to send message");
    }

    return response.data;
  }
  async getConversation(conversationId: string): Promise<any> {
    const response = await this.apiAxios.get<any>(
      API_ENDPOINTS.GET_CONVERSATION.replace(":conversationId", conversationId),
    );

    if (response.status !== 200) {
      throw new Error("Failed to list conversations message");
    }

    return response.data;
  }

  async getConversationWithSummary(conversationId: string): Promise<any> {
    const response = await this.apiAxios.get<any>(
      API_ENDPOINTS.GET_CONVERSATION_WITH_SUMMARY.replace(
        ":conversationId",
        conversationId,
      ),
    );

    if (response.status !== 200) {
      throw new Error("Failed to list conversations message");
    }

    return response.data;
  }

  async deleteConversation(conversationId: string): Promise<any> {
    const response = await this.apiAxios.delete<any>(
      API_ENDPOINTS.DELETE_CONVERSATION.replace(
        ":conversationId",
        conversationId,
      ),
    );

    if (response.status !== 200) {
      throw new Error("Failed to dekete conversations message");
    }

    return response.data;
  }

  async sendMessage(conversationId: string, message: any): Promise<any> {
    const response = await this.apiAxios.post<any>(
      API_ENDPOINTS.SEND_MESSAGE.replace(":conversationId", conversationId),
      message,
    );

    if (response.status !== 201) {
      throw new Error("Failed to send message");
    }

    return response.data;
  }

  async updateMessage(
    conversationId: string,
    messageId: string,
    message: any,
    deleteAfter?: boolean,
  ) {
    const url = API_ENDPOINTS.UPDATE_MESSAGE.replace(
      ":conversationId",
      conversationId,
    ).replace(":messageId", messageId);

    console.log("message", message);
    const response = await this.apiAxios.put<any>(url, message, {
      params: {
        deleteAfter,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to update message");
    }

    return response.data;
  }

  async getContract(
    network: string,
    address: string,
    tokenId?: string,
  ): Promise<any | null> {
    try {
      // eslint-disable-next-line max-len
      const { data } = await this.apiAxios.get<LitActionConditions>(
        tokenId
          ? `${API_ENDPOINTS.NFT_METADATA}/${network}/${address}/${tokenId}`
          : `${API_ENDPOINTS.NFT_METADATA}/${network}/${address}`,
      );
      return data;
    } catch (err) {
      return null;
    }
  }

  async getWallet(ensName: string): Promise<any | null> {
    try {
      const { data } = await this.apiAxios.get<LitActionConditions>(
        `${API_ENDPOINTS.ENS}/${ensName}`,
      );
      return data;
    } catch (err) {
      return null;
    }
  }

  async subscribeToNewsletter(email: string): Promise<any> {
    try {
      const { data } = await this.apiAxios.post(
        `${API_ENDPOINTS.SUBSCRIBE_TO_NEWSLETTER}`,
        { email },
      );
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message;
      throw new Error(errorMessage);
    }
  }
}

export default ApiService;

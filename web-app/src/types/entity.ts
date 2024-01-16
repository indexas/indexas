/**
 * Model indexes
 *
 */

import { CID } from "multiformats";

export type Indexes = {
  id: string
  title: string | null
  collabAction: string
  pkpPublicKey: string
  signerFunction: string
  signerPublicKey: string
  controllerDID: { // This is PKP DID
    id: string
  };
  ownerDID: Users;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  links: IndexLink[];
  isOwner?: boolean;
  isCreator: boolean;
  isStarred?: boolean;
  isPermittedAddress?: boolean;
};

export type IndexLink = {
  id?: string
  indexId?: string;
  linkId?: string;
  indexerDID?: { // This is PKP DID
    id: string
  } | string;
  controllerDID?: { // This is PKP DID
    id: string
  };
  link?: Link;
  index?: Indexes;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  highlight?: {
    title?: string;
    "link.content"?: string;
    "link.tags"?: string;
    "link.url"?: string;
    "link.title"?: string;
  }
};

/**
 * Model UserIndex
 *
 */
export type UserIndex = {
  id: string;
  indexId: string;
  controllerDID?: { // This is PKP DID
    id: string
  };
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

/**
 * Model links
 *
 */
export type Link = {
  id?: string;
  indexId?: string;
  indexerDID?: string;
  content?: string
  title?: string
  url?: string
  description?: string
  language?: string
  favicon?: string
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  images?: string[]
  favorite?: boolean;
  tags?: string[];
};

/**
 * Model users
 *
 */
export interface Users {
  id?: string;
  name?: string;
  bio?: string;
  avatar?: CID;
  available?: boolean; // TODO debug
  createdAt?: string;
  updatedAt?: string;
}

export interface LinkContentResult {
  id?: string;
  address: string;
  links: Link[];
}

export interface SyncCompleteResult {
  deletedCount: number,
}
/**
 * Enums
 */

export interface AccessControlCondition {
  chain: string;
  method: string;
  standardContractType: string;
  contractAddress: string;
  conditionType: string;
  parameters: string[];
  returnValueTest: object;
}

export interface IndexListState {
  skip: number,
  totalCount: number,
  hasMore: boolean,
  indexes?: Indexes[],
}
export interface MultipleIndexListState {
  all: IndexListState,
  owner: IndexListState,
  starred: IndexListState,
}

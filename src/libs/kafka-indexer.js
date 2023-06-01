import dotenv from 'dotenv'
if(process.env.NODE_ENV !== 'production'){
    dotenv.config()
}

import { Client } from '@elastic/elasticsearch'

const client = new Client({ node: process.env.ELASTIC_HOST })

import RedisClient from '../clients/redis.js';
const redis = RedisClient.getInstance();

import {getIndexById, getIndexLinkById, getLinkById} from "./composedb.js";

const config = {
    indexName: 'links'
}

export const createIndex = async (indexMsg) => {
    console.log("createIndex", indexMsg)

    let index = await getIndexById(indexMsg.id)

    await client.index({
        index: config.indexName,
        id: `index-${index.id}`,
        refresh: true,
        document: {
            index
        },
    });

    console.log(index)

    // TODO Handle before mainnet.
    /* Creates user_index without a composedb record. Only remove requests are stored in composedb.
    await this.createUserIndex({
        "controllerDID": index.ownerDID.id,
        "type":"my_indexes",
        "indexId": index.id,
        "createdAt": new Date().toISOString()
    });
     */

}
export const updateIndex = async (indexMsg) => {
    console.log("updateIndex", indexMsg)

    let index = await getIndexById(indexMsg.id)

    //Index index
    await client.index({
        index: config.indexName,
        id: `index-${index.id}`,
        refresh: true,
        document: {
            index
        },
    })

    //Index links
    await client.updateByQuery({
        index: config.indexName,
        refresh: true,
        conflicts: "proceed",
        script: {
            lang: 'painless',
            source: 'ctx._source.index = params.index',
            params: {
                index: index
            }
        },
        query: {
            bool: {
                must: [
                    {
                        term: {
                            "index.id": index.id
                        },
                    },
                    {
                        exists: {
                            field: "id",
                        },
                    }
                ],
            },
        },
    })
}
export const createIndexLink = async (indexLinkMsg) => {
    console.log("createIndexLink", indexLinkMsg)

    let indexLink = await getIndexLinkById(indexLinkMsg.id)
    delete indexLink.link.content // TODO fix stored in the indexer only, for now.

    await client.update({
        index: config.indexName,
        id: indexLink.id,
        refresh: true,
        doc_as_upsert: true,
        doc: indexLink,
    })
}
export const updateIndexLink = async (indexLinkMsg) => {

    console.log("updateIndexLink", indexLinkMsg)

    let indexLink = await getIndexLinkById(indexLinkMsg.id)
    delete indexLink.link.content  // TODO fix stored in the indexer only, for now.

    await client.update({
        index: config.indexName,
        id: indexLink.id,
        refresh: true,
        doc_as_upsert: true,
        doc: indexLink
    })
}


export const createLink = async (link) => {
    console.log("createLink - Ignore", link)
}

export const updateLink = async (linkMsg) => {

    console.log("updateLink", linkMsg)
    const link = await getLinkById(linkMsg.id)
    delete link.content
    //Index links
    await client.updateByQuery({
        index: config.indexName,
        refresh: true,
        conflicts: "proceed",
        script: {
            lang: 'painless',
            source: 'ctx._source.link = params.link',
            params: {
                link
            }
        },
        query: {
            bool: {
                must: [
                    {
                        term: {
                            "link.id": link.id
                        },
                    }
                ],
            },
        },
    })
}



export const updateLinkContent = async (url, content) => {

    console.log("updateLinkContent", url, content)

    await client.updateByQuery({
        index: config.indexName,
        refresh: true,
        conflicts: "proceed",
        script: {
            lang: 'painless',
            source: 'ctx._source.content = params.content',
            params: {
                content
            }
        },
        query: {
            bool: {
                must: [
                    {
                        "multi_match": {
                            "query": url,
                            "type": "bool_prefix",
                            "fields": [
                                "url"
                            ],
                            "minimum_should_match": "100%"
                        }
                    },
                    {
                        exists: {
                            field: "id",
                        },
                    }
                ],
            },
        },
    })
}
export const createUserIndex = async (user_index) => {
    console.log("createUserIndex", user_index)
    await redis.hSet(`user_indexes:by_did:${user_index.controllerDID.toLowerCase()}`, `${user_index.indexId}:${user_index.type}`, JSON.stringify(user_index))
}
export const updateUserIndex = async (user_index) => {
    console.log("updateUserIndex", user_index)
    if(user_index.deletedAt){
        await redis.hDel(`user_indexes:by_did:${user_index.controllerDID.toLowerCase()}`, `${user_index.indexId}:${user_index.type}`)
    }
}

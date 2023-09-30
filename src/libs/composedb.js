import _ from 'lodash';
import RedisClient from '../clients/redis.js';
import moment from "moment";
import {getOwner, getOwnerProfile} from "../utils/lit/index.js";


export const getProfile = async(did) => {
    let results = await fetch(`${process.env.COMPOSEDB_HOST}/graphql`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `{
              node(id: "${id}") {
                ... on IndexLink {
                  id
                  indexId
                  linkId
                  createdAt
                  updatedAt
                  deletedAt
                  indexerDID {
                    id
                  }
                  controllerDID {
                    id
                  }
                  index {
                    id
                    controllerDID {
                      id
                    }        
                    title
                    collabAction
                    pkpPublicKey
                    createdAt
                    updatedAt
                    deletedAt
                  }
                  link {
                    id
                    controllerDID {
                      id
                    }
                    title
                    url
                    favicon
                    tags
                    content
                    createdAt
                    updatedAt
                    deletedAt
                  }
                }
              }
            }`
        })
    })
    let res = await results.json();
    return res.data.node;
}


export const getIndexLinkById = async(id) => {
    let results = await fetch(`${process.env.COMPOSEDB_HOST}/graphql`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `{
              node(id: "${id}") {
                ... on IndexLink {
                  id
                  indexId
                  linkId
                  createdAt
                  updatedAt
                  deletedAt
                  indexerDID {
                    id
                  }
                  controllerDID {
                    id
                  }
                  index {
                    id
                    controllerDID {
                      id
                    }        
                    title
                    collabAction
                    pkpPublicKey
                    createdAt
                    updatedAt
                    deletedAt
                  }
                  link {
                    id
                    controllerDID {
                      id
                    }
                    title
                    url
                    favicon
                    tags
                    content
                    createdAt
                    updatedAt
                    deletedAt
                  }
                }
              }
            }`
        })
    })
    let res = await results.json();
    return res.data.node;
}


export const getLinkById = async(id) => {
    let results = await fetch(`${process.env.COMPOSEDB_HOST}/graphql`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `{
              node(id: "${id}") {
                ... on Link {
                    id
                    controllerDID {
                      id
                    }
                    title
                    url
                    favicon
                    tags
                    content
                    createdAt
                    updatedAt
                    deletedAt
                }
              }
            }`
        })
    })
    let res = await results.json();
    return res.data.node;
}

export const getIndexById = async (id) => {
        let results = await fetch(`${process.env.COMPOSEDB_HOST}/graphql`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `{
                node(id:"${id}"){
                  id
                  ... on Index{
                    id
                    title
                    collabAction
                    pkpPublicKey
                    createdAt
                    updatedAt
                    deletedAt
                    controllerDID {
                        id
                    }
                    links(last:1) {
                        edges {
                          node {
                            updatedAt
                          }
                        }
                    }                    
                }}
          }`
        })
    })

    let res = await results.json();
    let index = res.data.node;

    if(!index){
        return false;
    }

    if (index.links.edges.length > 0 && (moment(index.links.edges[0].node.updatedAt) > moment(index.updatedAt))) {
        index.updatedAt = index.links.edges[0].node.updatedAt;
    }

    delete index.links;

    index.ownerDID = await getOwnerProfile(index.pkpPublicKey);

    return index;
}

export const getIndexByPKP = async (id) => {

    let results = await fetch(`${process.env.COMPOSEDB_HOST}/graphql`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `{
              node(id: "${id}") {
                ... on CeramicAccount {
                  id
                  indexList(first: 1) {
                    edges {
                      node {
                        id
                        title
                        collabAction
                        pkpPublicKey
                        createdAt
                        updatedAt
                        controllerDID {
                            id
                        }
                        links(last:1) {
                            edges {
                                node {
                                    updatedAt
                                }
                            }
                        }                           
                      }
                    }
                  }
                }
              }
            }`
        })
    })
    let res = await results.json();
    let indexes = res.data.node.indexList.edges
    if(indexes.length === 0){
        return false;
    }
    let index = indexes[0].node.id;

    if (index.links.edges.length > 0 && (moment(index.links.edges[0].node.updatedAt) > moment(index.updatedAt))) {
        index.updatedAt = index.links.edges[0].node.updatedAt;
    }
    delete index.links

    index.ownerDID = await getOwnerProfile(index.pkpPublicKey);

    return index;
}


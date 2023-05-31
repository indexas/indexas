export const definition = {
	models: {
		Index: { id: "kjzl6hvfrbw6c8e8rlhx3guuoc1o6i4vni5emzh2c48aa5pn0u71jggun7rtu2a", accountRelation: { type: "list" } }, Link: { id: "kjzl6hvfrbw6c72mna95slfmi9nth1fp3bacc2ai7i6g1scygmo7awxsjl4dlpk", accountRelation: { type: "list" } }, IndexLink: { id: "kjzl6hvfrbw6c6vpgfoph7e98nkj4ujmd7bgw5ylb6uzmpts1yjva3zdjk0bhe9", accountRelation: { type: "list" } }, BasicProfile: { id: "kjzl6hvfrbw6c67dwa9r9k34j8w7ht8d8qcu4j620i5usbfmyb8iqqemwvc9zlk", accountRelation: { type: "single" } }, UserIndex: { id: "kjzl6hvfrbw6c5gi8p8j811v4u9tpel9m9lo11hm9ks74c1l0fhmnebsbtwusso", accountRelation: { type: "list" } },
	},
	objects: {
		Index: {
			title: { type: "string", required: true }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, collabAction: { type: "string", required: true }, pkpPublicKey: { type: "string", required: true }, version: { type: "view", viewType: "documentVersion" }, controllerDID: { type: "view", viewType: "documentAccount" }, links: { type: "view", viewType: "relation", relation: { source: "queryConnection", model: "kjzl6hvfrbw6c6vpgfoph7e98nkj4ujmd7bgw5ylb6uzmpts1yjva3zdjk0bhe9", property: "indexId" } }, linksCount: { type: "view", viewType: "relation", relation: { source: "queryCount", model: "kjzl6hvfrbw6c6vpgfoph7e98nkj4ujmd7bgw5ylb6uzmpts1yjva3zdjk0bhe9", property: "indexId" } },
		},
		Link: {
			url: { type: "string", required: true }, tags: { type: "list", required: false, item: { type: "string", required: false } }, title: { type: "string", required: false }, content: { type: "string", required: false }, favicon: { type: "string", required: false }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, version: { type: "view", viewType: "documentVersion" }, controllerDID: { type: "view", viewType: "documentAccount" },
		},
		IndexLink: {
			linkId: { type: "streamid", required: true }, indexId: { type: "streamid", required: true }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, indexerDID: { type: "did", required: true }, link: { type: "view", viewType: "relation", relation: { source: "document", model: "kjzl6hvfrbw6c72mna95slfmi9nth1fp3bacc2ai7i6g1scygmo7awxsjl4dlpk", property: "linkId" } }, index: { type: "view", viewType: "relation", relation: { source: "document", model: "kjzl6hvfrbw6c8e8rlhx3guuoc1o6i4vni5emzh2c48aa5pn0u71jggun7rtu2a", property: "indexId" } }, controllerDID: { type: "view", viewType: "documentAccount" },
		},
		BasicProfile: {
			name: { type: "string", required: true }, emoji: { type: "string", required: false }, gender: { type: "string", required: false }, description: { type: "string", required: false },
		},
		UserIndex: {
			type: { type: "string", required: false }, indexId: { type: "streamid", required: true }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, index: { type: "view", viewType: "relation", relation: { source: "document", model: "kjzl6hvfrbw6c8e8rlhx3guuoc1o6i4vni5emzh2c48aa5pn0u71jggun7rtu2a", property: "indexId" } }, version: { type: "view", viewType: "documentVersion" }, controllerDID: { type: "view", viewType: "documentAccount" },
		},
	},
	enums: {},
	accountData: {
		indexList: { type: "connection", name: "Index" }, linkList: { type: "connection", name: "Link" }, indexLinkList: { type: "connection", name: "IndexLink" }, basicProfile: { type: "node", name: "BasicProfile" }, userIndexList: { type: "connection", name: "UserIndex" },
	},
};

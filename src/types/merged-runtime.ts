// This is an auto-generated file, do not edit manually
export const definition = {
	models: {
		Profile: { id: "kjzl6hvfrbw6ca52q3feusjpl2r49wv9x0odyd2zmaytyq8ddunud4243rvl3gm", accountRelation: { type: "single" } },
		Index: { id: "kjzl6hvfrbw6caw09g11y7vy1qza903xne35pi30xvmelvnvlfxy9tadwwkzzd6", accountRelation: { type: "list" } },
		Link: { id: "kjzl6hvfrbw6c92114fj79ii6shyl8cbnsz5ol3v62s0uu3m78gy76gzaovpaiu", accountRelation: { type: "list" } },
		IndexLink: { id: "kjzl6hvfrbw6c8a1u7qrk1xcz5oty0temwn2szbmhl8nfnw9tddljj4ue8wba68", accountRelation: { type: "list" } },
		UserIndex: { id: "kjzl6hvfrbw6c9aw0xd4vlhqc5mx57f0y2xmm8xiyxzzj1abrizfyppup22r9ac", accountRelation: { type: "list" } },
	},
	objects: {
		Profile: {
			bio: { type: "string", required: false }, name: { type: "string", required: false }, avatar: { type: "cid", required: false }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, controllerDID: { type: "view", viewType: "documentAccount" },
		},
		Index: {
			title: { type: "string", required: true }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, collabAction: { type: "string", required: true }, pkpPublicKey: { type: "string", required: true }, version: { type: "view", viewType: "documentVersion" }, controllerDID: { type: "view", viewType: "documentAccount" }, links: { type: "view", viewType: "relation", relation: { source: "queryConnection", model: "kjzl6hvfrbw6c8a1u7qrk1xcz5oty0temwn2szbmhl8nfnw9tddljj4ue8wba68", property: "indexId" } }, linksCount: { type: "view", viewType: "relation", relation: { source: "queryCount", model: "kjzl6hvfrbw6c8a1u7qrk1xcz5oty0temwn2szbmhl8nfnw9tddljj4ue8wba68", property: "indexId" } },
		},
		Link: {
			url: { type: "string", required: true }, tags: { type: "list", required: false, item: { type: "string", required: false } }, title: { type: "string", required: false }, content: { type: "string", required: false }, favicon: { type: "string", required: false }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, version: { type: "view", viewType: "documentVersion" }, controllerDID: { type: "view", viewType: "documentAccount" },
		},
		IndexLink: {
			linkId: { type: "streamid", required: true }, indexId: { type: "streamid", required: true }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, indexerDID: { type: "did", required: true }, link: { type: "view", viewType: "relation", relation: { source: "document", model: "kjzl6hvfrbw6c92114fj79ii6shyl8cbnsz5ol3v62s0uu3m78gy76gzaovpaiu", property: "linkId" } }, index: { type: "view", viewType: "relation", relation: { source: "document", model: "kjzl6hvfrbw6caw09g11y7vy1qza903xne35pi30xvmelvnvlfxy9tadwwkzzd6", property: "indexId" } }, controllerDID: { type: "view", viewType: "documentAccount" },
		},
		UserIndex: {
			type: { type: "string", required: false }, indexId: { type: "streamid", required: true }, createdAt: { type: "datetime", required: true }, deletedAt: { type: "datetime", required: false }, updatedAt: { type: "datetime", required: true }, index: { type: "view", viewType: "relation", relation: { source: "document", model: "kjzl6hvfrbw6caw09g11y7vy1qza903xne35pi30xvmelvnvlfxy9tadwwkzzd6", property: "indexId" } }, version: { type: "view", viewType: "documentVersion" }, controllerDID: { type: "view", viewType: "documentAccount" },
		},
	},
	enums: {},
	accountData: {
		profile: { type: "node", name: "Profile" }, indexList: { type: "connection", name: "Index" }, linkList: { type: "connection", name: "Link" }, indexLinkList: { type: "connection", name: "IndexLink" }, userIndexList: { type: "connection", name: "UserIndex" },
	},
};

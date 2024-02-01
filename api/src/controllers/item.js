import {ItemService} from "../services/item.js";
import {IndexService} from "../services/index.js";
import {getPKPSession} from "../libs/lit/index.js";

export const listItems = async (req, res, next) => {
    const { indexId } = req.params;
    const { cursor, limit } = req.query;
    try {

        const itemService = new ItemService();
        const response = await itemService.getIndexItems(indexId, cursor, limit)

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addItem = async (req, res, next) => {
    const {indexId, itemId} = req.params;
    try {

        const indexService = new IndexService();
        const index = await indexService.getIndexById(indexId);
        const pkpSession = await getPKPSession(req.session, index);

        const itemService = new ItemService().setSession(pkpSession);
        const item = await itemService.addItem(indexId, itemId);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    //Queue embeddings.
};
export const removeItem = async (req, res, next) => {
    const {indexId, itemId} = req.params;
    try {

        const indexService = new IndexService();
        const index = await indexService.getIndexById(indexId);
        const pkpSession = await getPKPSession(req.session, index);

        const itemService = new ItemService().setSession(pkpSession);
        const item = await itemService.removeItem(indexId, itemId);
        res.status(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    //Queue embeddings
};

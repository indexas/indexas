import { DIDService } from "../services/did.js";
export const getIndexes = async (req, res, next) => {
    // sendLit(req.params.id) //TODO Fix later.

    try {
        const didService = new DIDService().setSession(req.session)
        const { type } = req.query;
        const indexes = await didService.getIndexes(req.params.id, type)
        res.status(200).json(indexes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addIndex = async (req, res, next) => {

    if(req.params.id !== req.session.did.parent) {
        return res.status(500).json({ error: "Authorization error" });
    }
    const {indexId, type} = req.body;
    try {
        const didService = new DIDService().setSession(req.session);
        const newIndex = await didService.addIndex(indexId, type)
        res.status(201).json(newIndex);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const removeIndex = async (req, res, next) => {

    if(req.params.id !== req.session.did.parent) {
        return res.status(500).json({ error: "Authorization error" });
    }

    const {indexId, type} = req.body;
    try {
        const didService = new DIDService().setSession(req.session)
        const newIndex = await didService.removeIndex(indexId, type)
        res.status(200).json(newIndex);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createProfile = async (req, res, next) => {
    if(req.params.id !== req.session.did.parent) {
        return res.status(500).json({ error: "Authorization error" });
    }
    try {
        const didService = new DIDService().setSession(req.session);
        const profile = await didService.createProfile(req.body)
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const didService = new DIDService()
        const profile = await didService.getProfile(req.params.id)
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
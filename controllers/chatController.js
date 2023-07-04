import * as chatModel from '../models/chatModel.js';

export const createChat = async (req, res) => {
    const {character_id} = req.body;
    const user_id = req.user.id;

    try {
        const result = await chatModel.createChat(user_id, character_id);
        if (result.status === 'exists') {
            res.status(409).json({message: 'Chat already exists', id: result.id});
        } else {
            res.status(201).json({message: 'Chat created', id: result.id});
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getChat = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await chatModel.getChat(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Chat not found') {
            res.status(404).json({message: error.message});
        } else {
            res.status(500).json({message: 'Internal server error'});
        }
    }
}

export const getChatFromUserID = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await chatModel.getChatFromUserID(id);
        if (result.length === 0) {
            res.status(404).json({message: 'No chats found for this user ID'});
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getChatFromCharacterID = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await chatModel.getChatFromCharacterID(id);
        if (result.length === 0) {
            res.status(404).json({message: 'No chats found for this character ID'});
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getChats = async (req, res) => {
    try {
        const result = await chatModel.getChats();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

export const updateChat = async (req, res) => {
    const {id} = req.params;
    const {character_id} = req.body;
    const user_id = req.user.id;

    try {
        const result = await chatModel.updateChat(user_id, character_id, id);
        if (result === 0) {
            res.status(404).json({message: 'Chat not found'});
        } else {
            res.status(200).json({message: 'Chat updated'});
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

export const deleteChat = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await chatModel.deleteChat(id);
        if (result === 0) {
            res.status(404).json({message: 'Chat not found'});
        } else {
            res.status(200).json({message: 'Chat deleted'});
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

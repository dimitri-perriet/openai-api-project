import openaiAPI from "../config/openaiConfig.js";
import * as MessageModel from "../models/convModel.js";

const openai = openaiAPI()

async function generateMessage(conv, game, character) {
    let messagesList = []
    messagesList.push({
        role: "system",
        content: "Tu es" + character + " du jeu vidéo" + game + ". Tu dois répondre uniquement en imitant ce personnage et ne pas sortir de ce personnage sous aucun prétexte."
    })
    for (let i = 0; i < conv.length; i++) {
        if (conv[i].type === "user") {
            messagesList.push({role: "user", content: conv[i].message})
        } else if (conv[i].type === "assistant") {
            messagesList.push({role: "assistant", content: conv[i].message})
        }
    }

    let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messagesList,
    });

    return completion.data.choices[0].message.content.trim();
}

export const createMessage = async (req, res) => {
    const {chat_id, message} = req.body

    try {
        await MessageModel.insertMessage("user", chat_id, message);

        const result = await MessageModel.selectGameName(chat_id);
        let gameName = result[0].game_name
        let characterName = result[0].character_name

        const messages = await MessageModel.selectAllFromChatID(chat_id);

        let response = await generateMessage(messages, gameName, characterName)

        await MessageModel.insertMessage("assistant", chat_id, response);

        res.status(201).json({message: 'Message created', chat: response, id: result.insertId})

    } catch (err) {
        res.status(500).json({message: 'Internal server error'})
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await MessageModel.selectAll();
        if (!messages.length) {
            res.status(404).json({message: 'Conversation not found'})
        } else {
            res.status(200).json(messages)
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const getMessage = async (req, res) => {
    const {id} = req.params

    try {
        const message = await MessageModel.selectByID(id);
        if (!message.length) {
            res.status(404).json({message: 'Message not found'})
        } else {
            res.status(200).json(message[0])
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const getMessageFromChatID = async (req, res) => {
    const {id} = req.params

    try {
        const messages = await MessageModel.selectAllFromChatID(id);
        if (!messages.length) {
            res.status(404).json({message: 'Conversation not found'})
        } else {
            res.status(200).json(messages)
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const deleteMessage = async (req, res) => {
    const {id} = req.params

    try {
        const message = await MessageModel.selectByID(id);
        if (!message.length) {
            res.status(404).json({message: 'Message not found'})
        } else {
            await MessageModel.deleteByID(id);
            res.status(200).json({message: 'Message deleted'})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const updateMessage = async (req, res) => {
    const {id} = req.params
    const {message} = req.body

    try {
        await MessageModel.updateByID(message, id);
        res.status(200).json({message: 'Message updated'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

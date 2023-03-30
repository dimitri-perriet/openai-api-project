import connectionRequest from '../config/connectionRequest.js'
import openaiAPI from "../config/openaiConfig.js";

// créer une connexion à la base de données
const db = connectionRequest()

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

export const createMessage = (req, res) => {
    const {chat_id, message} = req.body

    db.query('INSERT INTO conversation (type, chat_id, message) VALUES (?, ?, ?)', ["user", chat_id, message], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }


        //Récupération du nom du jeu pour l'envoyer à l'API
        db.query('SELECT g.name AS game_name, ca.name as character_name FROM conversation m INNER JOIN chat ch ON (m.chat_id=ch.ID) INNER JOIN game_character ca ON (ch.character_id=ca.ID) INNER JOIN games g ON (ca.game_id=g.ID) WHERE ch.ID = ? GROUP BY ch.ID', [chat_id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({message: err.message})
            }

            let gameName = result[0].game_name
            let characterName = result[0].character_name


            new Promise((resolve, reject) => {

                db.query('SELECT * FROM conversation WHERE chat_id = ? ORDER BY created ASC', [chat_id], (err, result) => {
                    if (err) {
                        // renvoyer une erreur en cas d'échec de la requête
                        return res.status(500).json({message: err.message})
                    }

                    // renvoyer un succès avec les données des personnages
                    const conv = result.map(message => {
                        return message
                    })

                    let response = generateMessage(conv, gameName, characterName)
                    resolve(response)
                })

            }).then((response) => {
                db.query(
                    'INSERT INTO conversation (type, chat_id, message) VALUES (?, ?, ?)',
                    ["assistant", chat_id, response],
                    (err, result) => {
                        if (err) {
                            // renvoyer une erreur en cas d'échec de la requête
                            return res.status(500).json({message: err.message})
                        }

                        // renvoyer un succès avec l'id du nouveau personnage
                        return res.status(201).json({message: 'Message created', chat: response, id: result.insertId})
                    }
                )
            }).catch((err) => {
                return res.status(500).json({message: err.message})
            });
        })
    })

}


export const getMessages = (req, res) => {

    // sélectionner le jeu par son id dans la base de données
    db.query('SELECT * FROM conversation ORDER BY created DESC', (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Conversation not found'})
        }

        // renvoyer un succès avec les données du jeu
        return res.status(200).json(result)
    })
}

export const getMessage = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner le jeu par son id dans la base de données
    db.query('SELECT * FROM conversation WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Message not found'})
        }


        // renvoyer un succès avec les données du jeu
        return res.status(200).json(result[0])
    })

}

export const getMessageFromChatID = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner la conv par son id dans la base de données
    db.query('SELECT * FROM conversation WHERE chat_id = ? ORDER BY created DESC', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si la conv n'existe pas
            return res.status(404).json({message: 'Conversation not found'})
        }

        const messages = result.map(message => {
            return message
        })

        // renvoyer un succès avec les données du jeu
        return res.status(200).json(messages)
    })
}

export const deleteMessage = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    //vérifier si le message existe
    db.query('SELECT * FROM conversation WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Message not found'})
        }

        // sélectionner le jeu par son id dans la base de données
        db.query('DELETE FROM conversation WHERE ID = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({message: err.message})
            }

            if (result.length === 0) {
                // renvoyer une erreur si le jeu n'existe pas
                return res.status(404).json({message: 'Message not found'})
            }

            // renvoyer un succès avec les données du jeu
            return res.status(200).json({message: 'Message deleted'})
        })
    })
}

export const updateMessage = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params
    const {message} = req.body

    // sélectionner le jeu par son id dans la base de données
    db.query('UPDATE conversation SET message = ?, updated = NOW() WHERE ID = ?', [message, id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Message not found'})
        }

        // renvoyer un succès avec les données du jeu
        return res.status(200).json({message: 'Message updated'})
    })
}


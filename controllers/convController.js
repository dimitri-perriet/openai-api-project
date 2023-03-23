const connectionRequest = require("../config/connectionRequest");

// créer une connexion à la base de données
const db = connectionRequest()

module.exports = {

    createMessage: (req, res) => {
        const { chat_id, message } = req.body

        db.query('INSERT INTO conversation (chat_id, message) VALUES (?, ?)', [chat_id, message], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            return res.status(201).json({ message: 'Message created', id: result.insertId })

            }
        )

    },

    getMessages: (req, res) => {

        // sélectionner le jeu par son id dans la base de données
        db.query('SELECT * FROM conversation', (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length === 0) {
                // renvoyer une erreur si le jeu n'existe pas
                return res.status(404).json({ message: 'Conversation not found' })
            }

            // renvoyer un succès avec les données du jeu
            return res.status(200).json(result)
        })
    },

    getMessage: (req, res) => {
        // récupérer l'id du paramètre de route
        const { id } = req.params

        // sélectionner le jeu par son id dans la base de données
        db.query('SELECT * FROM conversation WHERE ID = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length === 0) {
                // renvoyer une erreur si le jeu n'existe pas
                return res.status(404).json({ message: 'Conversation not found' })
            }


            // renvoyer un succès avec les données du jeu
            return res.status(200).json(result[0])
        })

    },

    getMessageFromChatID: (req, res) => {
        // récupérer l'id du paramètre de route
        const { id } = req.params

        // sélectionner la conv par son id dans la base de données
        db.query('SELECT * FROM conversation WHERE chat_id = ? ORDER BY created DESC', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length === 0) {
                // renvoyer une erreur si la conv n'existe pas
                return res.status(404).json({ message: 'Conversation not found' })
            }

            const messages = result.map(message => {
                return message
            })

            // renvoyer un succès avec les données du jeu
            return res.status(200).json(messages)
        })
    },

    deleteMessage: (req, res) => {
        // récupérer l'id du paramètre de route
        const { id } = req.params

        // sélectionner le jeu par son id dans la base de données
        db.query('DELETE FROM conversation WHERE ID = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length === 0) {
                // renvoyer une erreur si le jeu n'existe pas
                return res.status(404).json({ message: 'Message not found' })
            }

            // renvoyer un succès avec les données du jeu
            return res.status(200).json({ message: 'Message deleted' })
        })
    },

    updateMessage: (req, res) => {
        // récupérer l'id du paramètre de route
        const { id } = req.params
        const { message } = req.body

        // sélectionner le jeu par son id dans la base de données
        db.query('UPDATE conversation SET message = ? WHERE ID = ?', [message, id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length === 0) {
                // renvoyer une erreur si le jeu n'existe pas
                return res.status(404).json({ message: 'Message not found' })
            }

            // renvoyer un succès avec les données du jeu
            return res.status(200).json({ message: 'Message updated' })
        })
    }

}
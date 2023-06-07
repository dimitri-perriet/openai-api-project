import connectionRequest from "../config/connectionRequest.js";

// créer une connexion à la base de données
const db = connectionRequest()


export const createChat = (req, res) => {

    const {character_id} = req.body
    const user_id = req.user.id


    db.query('INSERT INTO chat (user_id, character_id) VALUES (?, ?)', [user_id, character_id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({message: err.message})
            }

            return res.status(201).json({message: 'Chat created', id: result.insertId})

        }
    )

}

export const getChat = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner le jeu par son id dans la base de données
    db.query('SELECT * FROM chat WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Chat not found'})
        }

        // renvoyer un succès avec les données du jeu
        return res.status(200).json(result[0])
    })
}

export const getChatFromUserID = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner la conv par son id dans la base de données
    db.query('SELECT * FROM chat WHERE user_id = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si la conv n'existe pas
            return res.status(404).json({message: 'Chat not found'})
        }

        // renvoyer un succès avec les données de la conv
        const chats = result.map(chat => {
            return chat
        })

        // renvoyer un succès avec les données du jeu
        return res.status(200).json(chats)
    })
}

export const getChatFromCharacterID = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner la conv par son id dans la base de données
    db.query('SELECT * FROM chat WHERE character_id = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si la conv n'existe pas
            return res.status(404).json({message: 'Chat not found'})
        }

        // renvoyer un succès avec les données de la conv
        const chats = result.map(chat => {
            return chat
        })

        // renvoyer un succès avec les données du jeu
        return res.status(200).json(chats)
    })
}

export const getChats = (req, res) => {
    // sélectionner toutes les conv dans la base de données
    db.query('SELECT * FROM chat', (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        // renvoyer un succès avec les données des jeux
        const chats = result.map(chat => {
            return chat
        })

        return res.status(200).json(chats)
    })
}

export const updateChat = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // récupérer les données envoyées
    const {character_id} = req.body
    const user_id = req.user.id


    // mettre à jour le jeu dans la base de données
    db.query('UPDATE chat SET user_id = ?, character_id = ?, updated = NOW() WHERE id = ?', [user_id, character_id, id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.affectedRows === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Chat not found'})
        }

        // renvoyer un succès avec les données du jeu
        return res.status(200).json({message: 'Chat updated'})
    })
}

export const deleteChat = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // supprimer le jeu de la base de données
    db.query('DELETE FROM chat WHERE id = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.affectedRows === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Chat not found'})
        }

        // renvoyer un succès avec les données du jeu
        return res.status(200).json({message: 'Chat deleted'})
    })
}

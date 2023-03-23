// importer le module mysql
const mysql = require('mysql2')
const connectionRequest = require("../config/connectionRequest");

// créer une connexion à la base de données
const db = connectionRequest()


// exporter les fonctions du contrôleur
module.exports = {
    // créer un nouveau jeu dans la base de données
    createGame: (req, res) => {
        // récupérer les données du corps de la requête
        const { user_id, name} = req.body

        // vérifier si le jeu existe déjà dans la base de données
        db.query('SELECT * FROM games WHERE user_id = ? AND name = ?', [user_id, name], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length > 0) {
                // renvoyer une erreur si le jeu est déjà utilisé
                return res.status(400).json({ message: 'Game already exists' })
            }

            // insérer le nouveau jeu dans la base de données
            db.query(
                'INSERT INTO games (user_id, name) VALUES (?, ?)',
                [user_id, name],
                (err, result) => {
                    if (err) {
                        // renvoyer une erreur en cas d'échec de la requête
                        return res.status(500).json({ message: err.message })
                    }

                    // renvoyer un succès avec l'id du nouveau jeu
                    res.status(201).json({ message: 'Game created', id: result.insertId })
                }
            )
        })
    },

    // récupérer un jeu par son id dans la base de données
    getGame: (req, res) => {
        // récupérer l'id du paramètre de route
        const { id } = req.params

        // sélectionner le jeu par son id dans la base de données
        db.query('SELECT * FROM games WHERE ID = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length === 0) {
                // renvoyer une erreur si le jeu n'existe pas
                return res.status(404).json({ message: 'Game not found' })
            }

            // renvoyer un succès avec les données du jeu
            const games = result[0]

            res.json(games)
        })
    },

    // récupérer tous les jeux dans la base de données
    getGames: (req, res) => {
        // sélectionner tous les jeux dans la base de données
        db.query('SELECT * FROM games', (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            // renvoyer un succès avec les données des jeux
            const games = result.map(game => {
                return game
            })

            res.json(games)
        })
    },

    // modifier un jeu par son id dans la base de données
    updateGame: (req, res) => {
        // récupérer l'id du paramètre de route et les données du corps de la requête
        const { id } = req.params
        const { user_id, name } = req.body

        // vérifier si le jeu existe déjà dans la base de données pour ce même utilisateur
        db.query(
            'SELECT * FROM games WHERE name = ? AND user_id = ? AND ID != ?',
            [name, user_id, id],
            (err, result) => {
                if (err) {
                    // renvoyer une erreur en cas d'échec de la requête
                    return res.status(500).json({ message: err.message })
                }

                if (result.length > 0) {
                    // renvoyer une erreur si le nom est déjà utilisé par l'utilisateur
                    return res.status(400).json({ message: 'Game already exists' })
                }

                // mettre à jour le jeu dans la base de données
                db.query(
                    'UPDATE games SET name = ?, updated = NOW() WHERE ID = ?',
                    [name, id],
                    (err, result) => {
                        if (err) {
                            // renvoyer une erreur en cas d'échec de la requête
                            return res.status(500).json({ message: err.message })
                        }

                        if (result.affectedRows === 0) {
                            // renvoyer une erreur si le jeu n'existe pas
                            return res.status(404).json({ message: 'Game not found' })
                        }

                        // renvoyer un succès avec le nombre de lignes modifiées
                        res.json({ message: 'Game updated', rowsAffected: result.affectedRows })
                    }
                )
            }
        )
    },

    // supprimer un jeu par son id dans la base de données
    deleteGame: (req, res) => {
        // récupérer l'id du paramètre de route
        const id = req.params.id
        // supprimer le jeu dans la base de données
        db.query('DELETE FROM games WHERE ID = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.affectedRows === 0) {
                // renvoyer une erreur si le jeu n'existe pas
                return res.status(404).json({ message: 'Game not found' })
            }

            // renvoyer un succès avec le nombre de lignes supprimées
            res.json({ message: 'Game deleted', rowsAffected: result.affectedRows })
        })
    },

    getGamesOwner: (req, res) => {
        // récupérer l'id du paramètre de route
        const { id } = req.params

        // sélectionner les jeux par son id user dans la base de données
        db.query('SELECT * FROM games WHERE user_id = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length === 0) {
                // renvoyer une erreur si aucun jeu n'existe pas
                return res.status(404).json({ message: 'Games not found or incorrect user id' })
            }

            // renvoyer un succès avec les données des jeux
            const games = result.map(game => {
                return game
            })

            res.json(games)
        })
    }

}
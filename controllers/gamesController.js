// importer le module mysql
import connectionRequest from '../config/connectionRequest.js'
import config from "../config/config.js";

// créer une connexion à la base de données
const db = connectionRequest()


async function getGamesInfo(name) {
    return await fetch("https://api.igdb.com/v4/games/", {
        method: 'POST',
        headers: {
            "Client-ID": config.client_igdb,
            "Authorization": "Bearer " + config.secret_igdb,
        },
        body: "search \"" + name + "\"; fields name, cover, first_release_date; where version_parent = null;"
    })
        .then(response => response.json())
        .then(data => {
            return data

        })
        .catch(err => {
            return err
        })
}

async function getGamesCover(coverid) {
    return await fetch("https://api.igdb.com/v4/covers", {
        method: 'POST',
        headers: {
            "Client-ID": config.client_igdb,
            "Authorization": "Bearer " + config.secret_igdb,
        },
        body: "fields url; where id = (" + coverid + ");"
    })
        .then(response => response.json())
        .then(data => {
            return data

        })
        .catch(err => {
            return err
        })
}

// exporter les fonctions du contrôleur
// créer un nouveau jeu dans la base de données
export const createGame = (req, res) => {
    // récupérer les données du corps de la requête
    const {user_id, name} = req.body

    // vérifier si le jeu existe déjà dans la base de données
    db.query('SELECT * FROM games WHERE user_id = ? AND name = ?', [user_id, name], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length > 0) {
            // renvoyer une erreur si le jeu est déjà utilisé
            return res.status(400).json({message: 'Game already exists'})
        }

        // insérer le nouveau jeu dans la base de données
        db.query(
            'INSERT INTO games (user_id, name) VALUES (?, ?)',
            [user_id, name],
            (err, result) => {
                if (err) {
                    // renvoyer une erreur en cas d'échec de la requête
                    return res.status(500).json({message: err.message})
                }

                // renvoyer un succès avec l'id du nouveau jeu
                res.status(201).json({message: 'Game created', id: result.insertId})
            }
        )
    })
}

//chercher un jeu par son nom
export const searchGame = async (req, res) => {
    // récupérer l'id du paramètre de route
    const {name} = req.params


    //appel api à https://api.igdb.com/v4/games/ pour avoir les infos
    let game = await getGamesInfo(name)

    if ( game instanceof Error) {
        // renvoyer une erreur si le jeu n'existe pas
        return res.status(500).json({message: 'Internal server error'})
    } else {
        if (game.length === 0 ) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Game not found'})
        } else {
            let imgurl = await getGamesCover(game[0].cover)

            if (imgurl instanceof Error) {
                // renvoyer une erreur si le jeu n'existe pas
                return res.status(500).json({message: 'Internal server error'})
            }

            if (imgurl[0].status === 400) {
                return res.status(404).json({message: 'Game not found'})
            }

            let date = new Date(game[0].first_release_date * 1000)
            game[0].first_release_date = date.toLocaleDateString("fr")
            imgurl[0].url = imgurl[0].url.replace("thumb", "cover_big")
            game[0].cover = imgurl[0].url



            // renvoyer un succès avec les données du jeu
            res.status(200).json(game[0])
        }
    }



}
// récupérer un jeu par son id dans la base de données
export const getGame = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner le jeu par son id dans la base de données
    db.query('SELECT * FROM games WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Game not found'})
        }

        // renvoyer un succès avec les données du jeu
        const games = result[0]

        return res.status(200).json(games)
    })
}

// récupérer tous les jeux dans la base de données
export const getGames = (req, res) => {
    // sélectionner tous les jeux dans la base de données
    db.query('SELECT * FROM games', (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        // renvoyer un succès avec les données des jeux
        const games = result.map(game => {
            return game
        })

        return res.status(200).json(games)
    })
}

// modifier un jeu par son id dans la base de données
export const updateGame = (req, res) => {
    // récupérer l'id du paramètre de route et les données du corps de la requête
    const {id} = req.params
    const {user_id, name} = req.body

    // vérifier si le jeu existe déjà dans la base de données pour ce même utilisateur
    db.query(
        'SELECT * FROM games WHERE name = ? AND user_id = ? AND ID != ?',
        [name, user_id, id],
        (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({message: err.message})
            }

            if (result.length > 0) {
                // renvoyer une erreur si le nom est déjà utilisé par l'utilisateur
                return res.status(400).json({message: 'Game already exists'})
            }

            // mettre à jour le jeu dans la base de données
            db.query(
                'UPDATE games SET name = ?, updated = NOW() WHERE ID = ?',
                [name, id],
                (err, result) => {
                    if (err) {
                        // renvoyer une erreur en cas d'échec de la requête
                        return res.status(500).json({message: err.message})
                    }

                    if (result.affectedRows === 0) {
                        // renvoyer une erreur si le jeu n'existe pas
                        return res.status(404).json({message: 'Game not found'})
                    }

                    // renvoyer un succès avec le nombre de lignes modifiées
                    return res.status(200).json({message: 'Game updated', rowsAffected: result.affectedRows})
                }
            )
        }
    )
}

// supprimer un jeu par son id dans la base de données
export const deleteGame = (req, res) => {
    // récupérer l'id du paramètre de route
    const id = req.params.id
    // supprimer le jeu dans la base de données
    db.query('DELETE FROM games WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.affectedRows === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Game not found'})
        }

        // renvoyer un succès avec le nombre de lignes supprimées
        return res.status(200).json({message: 'Game deleted', rowsAffected: result.affectedRows})
    })
}

export const getGamesOwner = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner les jeux par son id user dans la base de données
    db.query('SELECT * FROM games WHERE user_id = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si aucun jeu n'existe pas
            return res.status(404).json({message: 'Games not found or incorrect user id'})
        }

        // renvoyer un succès avec les données des jeux
        const games = result.map(game => {
            return game
        })

        return res.status(200).json(games)
    })
}

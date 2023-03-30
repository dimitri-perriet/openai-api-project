// importer le module mysql
import connectionRequest from "../config/connectionRequest.js";
import openaiAPI from "../config/openaiConfig.js";

// créer une connexion à la base de données
const db = connectionRequest()

const openai = openaiAPI()

async function getCharacterDetails(name, game) {
    let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "user",
            content: "Donnes moi les détails du personnage sous forme de liste rapide" + name + " du jeux vidéo" + game
        }],
    });

    return completion.data.choices[0].message.content.trim();
}


// créer un nouveau personnage dans la base de données
export const createCharacter = (req, res) => {

    const {game_id, name} = req.body

    // vérifier si le personnage existe déjà dans la base de données
    db.query('SELECT * FROM game_character WHERE game_id = ? AND name = ?', [game_id, name], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length > 0) {
            // renvoyer une erreur si le personnage est déjà utilisé
            return res.status(400).json({message: 'Character already exists'})
        }

        //Récupération du nom du jeu pour l'envoyer à l'API
        db.query('SELECT name FROM games WHERE ID = ?', [game_id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({message: err.message})
            }
            //Récupération du nom du jeu
            const gameName = result[0].name

            var create = async () => await new Promise((resolve, reject) => {
                let result = getCharacterDetails(name, gameName)
                resolve(result)
            }).then((result) => {
                db.query(
                    'INSERT INTO game_character (game_id, name, details) VALUES (?, ?, ?)',
                    [game_id, name, result],
                    (err, result) => {
                        if (err) {
                            // renvoyer une erreur en cas d'échec de la requête
                            return res.status(500).json({message: err.message})
                        }

                        // renvoyer un succès avec l'id du nouveau personnage
                        return res.status(201).json({message: 'Character created', id: result.insertId})
                    }
                )
            })
                .catch((err) => {
                    return res.status(500).json({message: err.message})
                });

            create();

        })

    })
}

// récupérer un personnage par son id dans la base de données
export const getCharacter = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner le personnage par son id dans la base de données
    db.query('SELECT * FROM game_character WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le personnage n'existe pas
            return res.status(404).json({message: 'Character not found'})
        }

        // renvoyer le personnage
        res.status(200).json(result[0])
    })
}
//Récupérer tous les personnages de la base de données
export const getCharacters = (req, res) => {
    // sélectionner tous les personnages dans la base de données
    db.query('SELECT * FROM game_character', (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        // renvoyer un succès avec les données des personnages
        const characters = result.map(character => {
            return character
        })

        // renvoyer les personnages
        res.status(200).json(characters)
    })
}

// récupérer tous les personnages d'un jeu dans la base de données
export const getCharactersFromGame = (req, res) => {
    // récupérer l'id du jeu du paramètre de route
    const {id} = req.params

    //Verifier si le jeu existe
    db.query('SELECT * FROM games WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le jeu n'existe pas
            return res.status(404).json({message: 'Game not found'})
        }

        // sélectionner tous les personnages du jeu dans la base de données
        db.query('SELECT * FROM game_character WHERE game_id = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({message: err.message})
            }

            // renvoyer un succès avec les données des jeux
            const characters = result.map(character => {
                return character
            })

            // renvoyer les personnages
            return res.status(200).json(characters)
        })
    })

}

// modifier un personnage dans la base de données
export const updateCharacter = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // récupérer les données du corps de la requête
    const {name} = req.body

    // vérifier si le personnage existe déjà dans la base de données
    db.query('SELECT * FROM game_character WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le personnage n'existe pas
            return res.status(404).json({message: 'Character not found'})
        }

        // modifier le personnage dans la base de données
        db.query(
            'UPDATE game_character SET name = ?, updated = NOW() WHERE ID = ?',
            [name, id],
            (err, result) => {
                if (err) {
                    // renvoyer une erreur en cas d'échec de la requête
                    return res.status(500).json({message: err.message})
                }

                // renvoyer un succès
                res.status(200).json({message: 'Character updated'})
            }
        )
    })
}

// supprimer un personnage dans la base de données
export const deleteCharacter = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // vérifier si le personnage existe dans la base de données
    db.query('SELECT * FROM game_character WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si le personnage n'existe pas
            return res.status(404).json({message: 'Character not found'})
        }

        // supprimer le personnage dans la base de données
        db.query('DELETE FROM game_character WHERE ID = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({message: err.message})
            }

            // renvoyer un succès
            res.status(200).json({message: 'Character deleted'})
        })
    })
}

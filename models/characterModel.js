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

export default {
    createCharacter: async (game_id, name) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM game_character WHERE game_id = ? AND name = ?', [game_id, name], async (err, result) => {
                if (err) {
                    reject(err.message);
                }

                if (result.length > 0) {
                    reject('Character already exists');
                } else {
                    db.query('SELECT name FROM games WHERE ID = ?', [game_id], async (err, result) => {
                        if (err) {
                            reject(err.message);
                        }
                        const gameName = result[0].name;
                        const details = await getCharacterDetails(name, gameName);
                        db.query('INSERT INTO game_character (game_id, name, details) VALUES (?, ?, ?)', [game_id, name, details], (err, result) => {
                            if (err) {
                                reject(err.message);
                            }
                            resolve(result.insertId);
                        })
                    })
                }
            })
        })
    },

    getCharacter: async (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM game_character WHERE ID = ?', [id], (err, result) => {
                if (err) {
                    reject(err.message);
                }

                if (result.length === 0) {
                    reject("Character not found");
                }

                resolve(result[0]);
            })
        })
    },

    getCharacters: async () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM game_character', (err, result) => {
                if (err) {
                    reject(err.message);
                }

                resolve(result);
            })
        })
    },

    getCharactersFromGame: async (game_id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM games WHERE ID = ?', [game_id], (err, result) => {
                if (err) {
                    reject(err.message);
                }

                if (result.length === 0) {
                    reject('Game not found');
                } else {
                    db.query('SELECT * FROM game_character WHERE game_id = ?', [game_id], (err, result) => {
                        if (err) {
                            reject(err.message);
                        }

                        resolve(result);
                    })
                }
            })
        })
    },

    updateCharacter: async (id, name) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM game_character WHERE ID = ?', [id], (err, result) => {
                if (err) {
                    reject(err.message);
                }

                if (result.length === 0) {
                    reject('Character not found');
                } else {
                    db.query('UPDATE game_character SET name = ? WHERE ID = ?', [name, id], (err, result) => {
                        if (err) {
                            reject(err.message);
                        }

                        resolve('Character updated');
                    })
                }
            })
        })
    },

    deleteCharacter: async (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM game_character WHERE ID = ?', [id], (err, result) => {
                if (err) {
                    reject(err.message);
                }

                if (result.length === 0) {
                    reject('Character not found');
                } else {
                    db.query('DELETE FROM game_character WHERE ID = ?', [id], (err, result) => {
                        if (err) {
                            reject(err.message);
                        }

                        resolve('Character deleted');
                    })
                }
            })
        })
    }
}

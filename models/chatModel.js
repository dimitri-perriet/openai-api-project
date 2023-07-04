import connectionRequest from "../config/connectionRequest.js";

const db = connectionRequest();

export const createChat = (user_id, character_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM chat WHERE user_id = ? AND character_id = ?', [user_id, character_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length !== 0) {
                    resolve({status: 'exists', id: result[0].ID});
                } else {
                    db.query('INSERT INTO chat (user_id, character_id) VALUES (?, ?)', [user_id, character_id], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({status: 'created', id: result.insertId});
                        }
                    });
                }
            }
        });
    });
}

export const getChat = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM chat WHERE ID = ?', [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length === 0) {
                    reject(new Error('Chat not found'));
                } else {
                    resolve(result[0]);
                }
            }
        });
    });
}

export const getChatFromUserID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM chat WHERE user_id = ?', [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export const getChatFromCharacterID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM chat WHERE character_id = ?', [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export const getChats = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM chat', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export const updateChat = (user_id, character_id, id) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE chat SET user_id = ?, character_id = ?, updated = NOW() WHERE id = ?', [user_id, character_id, id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.affectedRows);
            }
        });
    });
}

export const deleteChat = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM chat WHERE id = ?', [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.affectedRows);
            }
        });
    });
}

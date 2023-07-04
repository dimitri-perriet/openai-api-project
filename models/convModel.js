import connectionRequest from '../config/connectionRequest.js'

const db = connectionRequest()

export const insertMessage = (type, chat_id, message) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO conversation (type, chat_id, message) VALUES (?, ?, ?)', [type, chat_id, message],
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
    })
}

export const selectGameName = (chat_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT g.name AS game_name, ca.name as character_name FROM conversation m INNER JOIN chat ch ON (m.chat_id=ch.ID) INNER JOIN game_character ca ON (ch.character_id=ca.ID) INNER JOIN games g ON (ca.game_id=g.ID) WHERE ch.ID = ? GROUP BY ch.ID', [chat_id],
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
    })
}

export const selectAllFromChatID = (chat_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM conversation WHERE chat_id = ? ORDER BY created ASC', [chat_id],
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
    })
}

export const selectAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM conversation ORDER BY created ASC',
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
    })
}

export const selectByID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM conversation WHERE ID = ?', [id],
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
    })
}

export const deleteByID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM conversation WHERE ID = ?', [id],
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
    })
}

export const updateByID = (message, id) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE conversation SET message = ?, updated = NOW() WHERE ID = ?', [message, id],
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
    })
}

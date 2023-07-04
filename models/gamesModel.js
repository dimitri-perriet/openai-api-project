import connectionRequest from '../config/connectionRequest.js';

const db = connectionRequest()

export const insertGame = (user_id, name, cover) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO games (user_id, name, cover) VALUES (?, ?, ?)',
            [user_id, name, cover],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

export const selectGame = (user_id, name) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM games WHERE user_id = ? AND name = ?', [user_id, name], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

export const selectGameByID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM games WHERE ID = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

export const selectAllGames = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM games', (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

export const updateGameByID = (name, id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE games SET name = ?, updated = NOW() WHERE ID = ?',
            [name, id],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

export const deleteGameByID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM games WHERE ID = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

export const selectGamesByUserID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM games WHERE user_id = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

import connectionRequest from '../config/connectionRequest.js';
import bcrypt from 'bcrypt';

// créer une connexion à la base de données
const db = connectionRequest();

const selectUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE mail = ?', [email], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const insertUser = (firstname, lastname, email, password) => {
    // hacher le mot de passe
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO user (firstname, lastname, mail, password) VALUES (?, ?, ?, ?)',
            [firstname, lastname, email, hash],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    });
};

const selectUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE ID = ?', [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const selectAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user', (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const selectUserByEmailExceptId = (email, id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM user WHERE mail = ? AND ID != ?',
            [email, id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const updateUserById = (firstname, lastname, email, password, id) => {
    // hacher le mot de passe
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE user SET firstname = ?, lastname = ?, mail = ?, password = ?, updated = NOW() WHERE ID = ?',
            [firstname, lastname, email, hash, id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const deleteUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user WHERE ID = ?', [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const selectUserForLogin = (email) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT ID, firstname, lastname, password AS hash
                  FROM user
                  WHERE mail = '${email}'`,
            function (err, results, fields) {
                if (err) reject(err);
                resolve(results);
            });
    });
};

export {
    selectUserByEmail,
    insertUser,
    selectUserById,
    selectAllUsers,
    selectUserByEmailExceptId,
    updateUserById,
    deleteUserById,
    selectUserForLogin
}

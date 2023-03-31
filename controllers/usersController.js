// importer le module mysql
import bcrypt from 'bcrypt';
import connectionRequest from '../config/connectionRequest.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// créer une connexion à la base de données
const db = connectionRequest()


// exporter les fonctions du contrôleur

export const createUser = (req, res) => {
    // récupérer les données du corps de la requête
    const {firstname, lastname, email, password} = req.body

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({message: 'Missing parameters'})
    }

    // vérifier si l'email existe déjà dans la base de données
    db.query('SELECT * FROM user WHERE mail = ?', [email], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length > 0) {
            // renvoyer une erreur si l'email est déjà utilisé
            return res.status(409).json({message: 'Email already exists'})
        }

        // hacher le mot de passe
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);

        // insérer le nouvel utilisateur dans la base de données
        db.query(
            'INSERT INTO user (firstname, lastname, mail, password) VALUES (?, ?, ?, ?)',
            [firstname, lastname, email, hash],
            (err, result) => {
                if (err) {
                    // renvoyer une erreur en cas d'échec de la requête
                    return res.status(500).json({message: err.message})
                }

                // renvoyer un succès avec l'id du nouvel utilisateur
                res.status(201).json({message: 'User created', id: result.insertId})
            }
        )
    })
}

// récupérer un utilisateur par son id dans la base de données
export const getUser = (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params

    // sélectionner l'utilisateur par son id dans la base de données
    db.query('SELECT * FROM user WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.length === 0) {
            // renvoyer une erreur si l'utilisateur n'existe pas
            return res.status(404).json({message: 'User not found'})
        }

        // renvoyer un succès avec les données de l'utilisateur sans le mot de passe
        const user = result[0]
        delete user.password

        res.json(user)
    })
}

// récupérer tous les utilisateurs dans la base de données
export const getUsers = (req, res) => {
    // sélectionner tous les utilisateurs dans la base de données
    db.query('SELECT * FROM user', (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        // renvoyer un succès avec les données des utilisateurs sans les mots de passe
        const users = result.map(user => {
            delete user.password
            return user
        })

        res.json(users)
    })
}

// modifier un utilisateur par son id dans la base de données
export const updateUser = (req, res) => {
    // récupérer l'id du paramètre de route et les données du corps de la requête
    const {id} = req.params
    const {firstname, lastname, email, password} = req.body

    // vérifier si l'email existe déjà dans la base de données pour un autre utilisateur
    db.query(
        'SELECT * FROM user WHERE mail = ? AND ID != ?',
        [email, id],
        (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({message: err.message})
            }

            if (result.length > 0) {
                // renvoyer une erreur si l'email est déjà utilisé par un autre utilisateur
                return res.status(400).json({message: 'Email already exists'})
            }

            // hacher le mot de passe
            const saltRounds = 10;
            const hash = bcrypt.hashSync(password, saltRounds);

            // mettre à jour l'utilisateur dans la base de données
            db.query(
                'UPDATE user SET firstname = ?, lastname = ?, mail = ?, password = ?, updated = NOW() WHERE ID = ?',
                [firstname, lastname, email, hash, id],
                (err, result) => {
                    if (err) {
                        // renvoyer une erreur en cas d'échec de la requête
                        return res.status(500).json({message: err.message})
                    }

                    if (result.affectedRows === 0) {
                        // renvoyer une erreur si l'utilisateur n'existe pas
                        return res.status(404).json({message: 'User not found'})
                    }

                    // renvoyer un succès avec le nombre de lignes modifiées
                    res.json({message: 'User updated', rowsAffected: result.affectedRows})
                }
            )
        }
    )
}

// supprimer un utilisateur par son id dans la base de données
export const deleteUser = (req, res) => {
    // récupérer l'id du paramètre de route
    const id = req.params.id
    // supprimer l'utilisateur dans la base de données
    db.query('DELETE FROM user WHERE ID = ?', [id], (err, result) => {
        if (err) {
            // renvoyer une erreur en cas d'échec de la requête
            return res.status(500).json({message: err.message})
        }

        if (result.affectedRows === 0) {
            // renvoyer une erreur si l'utilisateur n'existe pas
            return res.status(404).json({message: 'User not found'})
        }

        // renvoyer un succès avec le nombre de lignes supprimées
        res.json({message: 'User deleted', rowsAffected: result.affectedRows})
    })
}

export const loginApi = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const connection = connectionRequest()


    connection.query(`SELECT ID, firstname, lastname, password AS hash
                      FROM user
                      WHERE mail = '${email}'`,
        function (err, results, fields) {
            if (results.length > 0 && (bcrypt.compareSync(password, results[0].hash))) {
                delete results[0].hash;
                const token = jwt.sign(
                    {
                        id: results[0].ID,
                        firstname: results[0].firstname,
                        lastname: results[0].lastname,
                    },
                    config.secret_jwt,
                    {
                        expiresIn: '24h',
                    });
                res.status(200).json({'message': 'Utilisateur connecté', 'authorization': token});
            } else {
                res.status(401).json({message: 'Identifiants incorrects'});
            }
        });
}

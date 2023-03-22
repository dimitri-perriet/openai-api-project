// importer le module mysql
const bcrypt = require('bcrypt')
const connectionRequest = require("../config/connectionRequest");

// créer une connexion à la base de données
const db = connectionRequest()


// exporter les fonctions du contrôleur
module.exports = {
    // créer un nouvel utilisateur dans la base de données
    createUser: (req, res) => {
        // récupérer les données du corps de la requête
        const { firstname, lastname, email, password } = req.body

        // vérifier si l'email existe déjà dans la base de données
        db.query('SELECT * FROM user WHERE mail = ?', [email], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length > 0) {
                // renvoyer une erreur si l'email est déjà utilisé
                return res.status(400).json({ message: 'Email already exists' })
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
                        return res.status(500).json({ message: err.message })
                    }

                    // renvoyer un succès avec l'id du nouvel utilisateur
                    res.status(201).json({ message: 'User created', id: result.insertId })
                }
            )
        })
    },
    register: (req, res) => {
        // récupérer les données du corps de la requête
        const { firstname, lastname, email, password } = req.body

        // vérifier si l'email existe déjà dans la base de données
        db.query('SELECT * FROM user WHERE mail = ?', [email], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length > 0) {
                req.flash('info', 'Email déjà utilisée');
                return res.redirect('/');
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
                        return res.status(500).json({ message: err.message })
                    }

                    req.flash('success', 'Votre compte a été crée avec succès');
                    return res.redirect('/');
                }
            )
        })
    },

    // récupérer un utilisateur par son id dans la base de données
    getUser: (req, res) => {
        // récupérer l'id du paramètre de route
        const { id } = req.params

        // sélectionner l'utilisateur par son id dans la base de données
        db.query('SELECT * FROM user WHERE ID = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.length === 0) {
                // renvoyer une erreur si l'utilisateur n'existe pas
                return res.status(404).json({ message: 'User not found' })
            }

            // renvoyer un succès avec les données de l'utilisateur sans le mot de passe
            const user = result[0]
            delete user.password

            res.json(user)
        })
    },

    // récupérer tous les utilisateurs dans la base de données
    getUsers: (req, res) => {
        // sélectionner tous les utilisateurs dans la base de données
        db.query('SELECT * FROM user', (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            // renvoyer un succès avec les données des utilisateurs sans les mots de passe
            const users = result.map(user => {
                delete user.password
                return user
            })

            res.json(users)
        })
    },

    // modifier un utilisateur par son id dans la base de données
    updateUser: (req, res) => {
        // récupérer l'id du paramètre de route et les données du corps de la requête
        const { id } = req.params
        const { firstname, lastname, email, password } = req.body

        // vérifier si l'email existe déjà dans la base de données pour un autre utilisateur
        db.query(
            'SELECT * FROM user WHERE mail = ? AND ID != ?',
            [email, id],
            (err, result) => {
                if (err) {
                    // renvoyer une erreur en cas d'échec de la requête
                    return res.status(500).json({ message: err.message })
                }

                if (result.length > 0) {
                    // renvoyer une erreur si l'email est déjà utilisé par un autre utilisateur
                    return res.status(400).json({ message: 'Email already exists' })
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
                            return res.status(500).json({ message: err.message })
                        }

                        if (result.affectedRows === 0) {
                            // renvoyer une erreur si l'utilisateur n'existe pas
                            return res.status(404).json({ message: 'User not found' })
                        }

                        // renvoyer un succès avec le nombre de lignes modifiées
                        res.json({ message: 'User updated', rowsAffected: result.affectedRows })
                    }
                )
            }
        )
    },

    // supprimer un utilisateur par son id dans la base de données
    deleteUser: (req, res) => {
        // récupérer l'id du paramètre de route
        const id = req.params.id
        // supprimer l'utilisateur dans la base de données
        db.query('DELETE FROM user WHERE ID = ?', [id], (err, result) => {
            if (err) {
                // renvoyer une erreur en cas d'échec de la requête
                return res.status(500).json({ message: err.message })
            }

            if (result.affectedRows === 0) {
                // renvoyer une erreur si l'utilisateur n'existe pas
                return res.status(404).json({ message: 'User not found' })
            }

            // renvoyer un succès avec le nombre de lignes supprimées
            res.json({ message: 'User deleted', rowsAffected: result.affectedRows })
        })
    },

    login: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const connection = connectionRequest()


        connection.query(`SELECT password AS hash FROM user WHERE mail = '${email}'`,
            function (err, results, fields) {
                if (results.length>0 && (bcrypt.compareSync(password, results[0].hash))) {
                    req.session.loggedin = true;
                    req.session.user_id = results[0].ID;
                    req.session.lastname = results[0].lastname;
                    req.session.firstname = results[0].firstname;
                    res.redirect('/games');
                } else {
                    req.flash('info', 'Identifiants incorrects');
                    res.redirect('/');
                }
            });
    },
    loginApi: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const connection = connectionRequest()


        connection.query(`SELECT password AS hash FROM user WHERE mail = '${email}'`,
            function (err, results, fields) {
                if (results.length>0 && (bcrypt.compareSync(password, results[0].hash))) {
                    res.status(200).json({ message: 'Utilisateur connecté'});
                } else {
                    res.status(401).json({ message: 'Identifiants incorrects'});
                }
            });
    }
}
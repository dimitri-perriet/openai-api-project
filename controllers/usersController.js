import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    // récupérer les données du corps de la requête
    const {firstname, lastname, email, password} = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({message: 'Missing parameters'});
    }

    try {
        // vérifier si l'email existe déjà dans la base de données
        const existingUser = await UserModel.selectUserByEmail(email);

        if (existingUser.length > 0) {
            return res.status(409).json({message: 'Email already exists'});
        }

        // insérer le nouvel utilisateur dans la base de données
        const result = await UserModel.insertUser(firstname, lastname, email, password);

        // renvoyer un succès avec l'id du nouvel utilisateur
        res.status(201).json({message: 'User created', id: result.insertId});
    } catch (err) {
        // renvoyer une erreur en cas d'échec de la requête
        res.status(500).json({message: err.message});
    }
};

export const getUser = async (req, res) => {
    // récupérer l'id du paramètre de route
    const {id} = req.params;

    try {
        // sélectionner l'utilisateur par son id dans la base de données
        const user = await UserModel.selectUserById(id);

        if (user.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        // renvoyer un succès avec les données de l'utilisateur sans le mot de passe
        delete user[0].password;

        res.json(user[0]);
    } catch (err) {
        // renvoyer une erreur en cas d'échec de la requête
        res.status(500).json({message: err.message});
    }
};

export const getUsers = async (req, res) => {
    try {
        // sélectionner tous les utilisateurs dans la base de données
        const users = await UserModel.selectAllUsers();

        // renvoyer un succès avec les données des utilisateurs sans les mots de passe
        const safeUsers = users.map(user => {
            delete user.password;
            return user;
        });

        res.json(safeUsers);
    } catch (err) {
        // renvoyer une erreur en cas d'échec de la requête
        res.status(500).json({message: err.message});
    }
};

export const updateUser = async (req, res) => {
    // récupérer l'id du paramètre de route et les données du corps de la requête
    const {id} = req.params;
    const {firstname, lastname, email, password} = req.body;

    try {
        // vérifier si l'email existe déjà dans la base de données pour un autre utilisateur
        const sameEmailUser = await UserModel.selectUserByEmailExceptId(email, id);

        if (sameEmailUser.length > 0) {
            return res.status(400).json({message: 'Email already exists'});
        }

        // mettre à jour l'utilisateur dans la base de données
        const result = await UserModel.updateUserById(firstname, lastname, email, password, id);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        // renvoyer un succès avec le nombre de lignes modifiées
        res.json({message: 'User updated', rowsAffected: result.affectedRows});
    } catch (err) {
        // renvoyer une erreur en cas d'échec de la requête
        res.status(500).json({message: err.message});
    }
};

export const deleteUser = async (req, res) => {
    // récupérer l'id du paramètre de route
    const id = req.params.id;

    try {
        // supprimer l'utilisateur dans la base de données
        const result = await UserModel.deleteUserById(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        // renvoyer un succès avec le nombre de lignes supprimées
        res.json({message: 'User deleted', rowsAffected: result.affectedRows});
    } catch (err) {
        // renvoyer une erreur en cas d'échec de la requête
        res.status(500).json({message: err.message});
    }
};

export const loginApi = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UserModel.selectUserForLogin(email);

        if (user.length > 0 && (bcrypt.compareSync(password, user[0].hash))) {
            delete user[0].hash;
            const token = jwt.sign(
                {
                    id: user[0].ID,
                    firstname: user[0].firstname,
                    lastname: user[0].lastname,
                },
                config.secret_jwt,
                {
                    expiresIn: '24h',
                });
            res.status(200).json({'message': 'Utilisateur connecté', 'authorization': token});
        } else {
            res.status(401).json({message: 'Identifiants incorrects'});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

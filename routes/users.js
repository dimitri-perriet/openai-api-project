import express from 'express';
const router = express.Router();


import {
    getUsers,
    deleteUser,
    updateUser,
    getUser,
    createUser,
    loginApi,
    register
} from '../controllers/usersController.js';

router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.post('/create', createUser);
router.post('/register', register);
router.post('/loginapi', loginApi);

export default router;
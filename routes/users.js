import express from 'express';
const router = express.Router();


import {
    getUsers,
    deleteUser,
    updateUser,
    getUser,
    createUser,
    loginApi,
} from '../controllers/usersController.js';
import {auth} from "../middleware/auth.middlewares.js";

router.get('/', auth, getUsers);
router.get('/:id', auth, getUser);
router.delete('/delete/:id', auth, deleteUser);
router.put('/update/:id', auth, updateUser);
router.post('/create', createUser);
router.post('/loginapi', loginApi);

export default router;
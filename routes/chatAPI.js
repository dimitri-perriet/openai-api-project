import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth.middlewares.js';

import {
    createChat,
    getChat,
    getChats,
    updateChat,
    deleteChat,
    getChatFromCharacterID,
    getChatFromUserID
} from '../controllers/chatController.js';

router.post('/create', auth, createChat);
router.get('/:id', auth, getChat);
router.get('/', auth, getChats);
router.get('/character/:id', auth, getChatFromCharacterID);
router.get('/user/:id', auth, getChatFromUserID);
router.put('/update/:id', auth, updateChat);
router.delete('/delete/:id', auth, deleteChat);

export default router;

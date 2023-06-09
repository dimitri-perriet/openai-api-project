import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth.middlewares.js';

import {
    createMessage,
    getMessage,
    getMessages,
    getMessageFromChatID,
    deleteMessage,
    updateMessage
} from '../controllers/convController.js';

router.post('/create', auth, createMessage);
router.get('/:id', auth, getMessage);
router.get('/chat/:id', auth, getMessageFromChatID);
router.put('/:id', auth, updateMessage);
router.delete('/:id', auth, deleteMessage);
router.get('/', auth, getMessages);

export default router;

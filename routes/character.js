import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth.middlewares.js';

import {
    createCharacter,
    getCharacter,
    getCharacters,
    updateCharacter,
    deleteCharacter,
    getCharactersFromGame
} from '../controllers/characterController.js';

router.post('/create', auth, createCharacter);
router.get('/:id', auth, getCharacter);
router.get('/', auth, getCharacters);
router.get('/game/:id', auth, getCharactersFromGame);
router.put('/update/:id', auth, updateCharacter);
router.delete('/delete/:id', auth, deleteCharacter);

export default router;

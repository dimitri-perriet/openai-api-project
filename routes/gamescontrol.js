import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth.middlewares.js';

import {
    createGame,
    getGame,
    getGames,
    getGamesOwner,
    updateGame,
    deleteGame,
} from '../controllers/gamesController.js';


router.post('/create', auth, createGame);
router.get('/:id', auth, getGame);
router.get('/', auth, getGames);
router.get('/user/:id', auth, getGamesOwner);
router.put('/update/:id', auth, updateGame);
router.delete('/delete/:id', auth, deleteGame);

export default router;

var express = require('express');
var router = express.Router();

const {
    createGame,
    getGame,
    getGames,
    getGamesOwner,
    updateGame,
    deleteGame,
} = require('../controllers/gamesController');


router.post('/create', createGame);
router.get('/:id', getGame);
router.get('/', getGames);
router.get('/user/:id', getGamesOwner);
router.put('/update/:id', updateGame);
router.delete('/delete/:id', deleteGame);

module.exports = router;
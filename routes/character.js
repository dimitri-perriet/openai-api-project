var express = require('express');
var router = express.Router();

const {
    createCharacter,
    getCharacter,
    getCharacters,
    updateCharacter,
    deleteCharacter,
    getCharactersFromGame
} = require('../controllers/characterController');

router.post('/create', createCharacter);
router.get('/:id', getCharacter);
router.get('/', getCharacters);
router.get('/game/:id', getCharactersFromGame);
router.put('/update/:id', updateCharacter);
router.delete('/delete/:id', deleteCharacter);

module.exports = router;

var express = require('express');
var router = express.Router();

const {
    createChat,
    getChat,
    getChats,
    updateChat,
    deleteChat,
    getChatFromCharacterID,
    getChatFromUserID
} = require('../controllers/chatController');

router.post('/create', createChat);
router.get('/:id', getChat);
router.get('/', getChats);
router.get('/character/:id', getChatFromCharacterID);
router.get('/user/:id', getChatFromUserID);
router.put('/update/:id', updateChat);
router.delete('/delete/:id', deleteChat);

module.exports = router;
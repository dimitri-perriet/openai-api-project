var express = require('express');
var router = express.Router();

const {
    createMessage,
    getMessage,
    getMessages,
    getMessageFromChatID,
    deleteMessage,
    updateMessage
} = require('../controllers/convController');

router.post('/create', createMessage);
router.get('/:id', getMessage);
router.get('/chat/:id', getMessageFromChatID);
router.put('/update/:id', updateMessage);
router.delete('/delete/:id', deleteMessage);
router.get('/', getMessages);

module.exports = router;

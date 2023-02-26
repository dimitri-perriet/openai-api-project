var express = require('express');
var router = express.Router();

const {
    getUsers,
    deleteUser,
    updateUser,
    getUser,
    createUser
} = require('../controllers/usersController');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/delete/:id', deleteUser);
router.post('/update/:id', updateUser);
router.post('/create', createUser);

module.exports = router;

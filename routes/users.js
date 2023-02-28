var express = require('express');
var router = express.Router();

const {
    getUsers,
    deleteUser,
    updateUser,
    getUser,
    createUser,
    login,
    loginApi
} = require('../controllers/usersController');

router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.post('/create', createUser);
router.post('/login', login);
router.post('/loginapi', loginApi);

module.exports = router;

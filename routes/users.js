const router = require('express').Router();
const { getUser } = require('../controllers/users');
const { validationGetUser } = require('../middlewares/requestValidation');

router.get('/users/me', validationGetUser, getUser);

module.exports = router;

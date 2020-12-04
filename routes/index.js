const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const NotFoundError = require('../errors/NotFoundError');
const { signin, signup } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validationCreateUser } = require('../middlewares/requestValidation');

router.post('/signin', signin);
router.post('/signup', validationCreateUser, signup);

router.use(auth);

router.use('/', users);
router.use('/', articles);
router.all('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден.')));

module.exports = router;

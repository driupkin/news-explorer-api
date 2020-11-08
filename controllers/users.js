const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET, NODE_ENV } = process.env;
const SALT_ROUNDS = 10;
// GET /users/me
const getUser = (req, res, next) => {
  User.findOne({ _id: req.user })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${err.message}`));
      }
      return next(err);
    });
};
// Регистрация и авторизация пользователя
// POST /signup
const signup = (req, res, next) => {
  const { email, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже есть');
      }
      return bcrypt.hash(req.body.password, SALT_ROUNDS)
        .then((hash) => User.create({
          name, email, password: hash,
        }))
        .then((data) => {
          // eslint-disable-next-line no-param-reassign
          data.password = null; // ?
          res.status(201).send(data);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${err.message}`));
      }
      return next(err);
    });
};
// POST /signin
const signin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      // проверяем пароль
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user; // если всё верно, возвращаем найденного usera
        });
    })
    .then((user) => {
      // создадим токен || значение по умолчанию
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

module.exports = { getUser, signin, signup };

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const cors = require('cors');

const users = require('./routes/users');
const articles = require('./routes/articles');
const { signin, signup } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/newsexpdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', signin);
app.post('/signup', signup);

app.use(auth);

app.use('/', users);
app.use('/', articles);

app.all('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден.')));

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { status = 500, message } = err;

  res
    .status(status)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: status === 500
        ? `На сервере произошла ошибка: ${err.message}`
        : message,
    });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { customErrors } = require('./middlewares/customErrors');
const router = require('./routes/index');
const { limiter } = require('./middlewares/rateLimiter');

const app = express();
const { PORT = 3000, MONGO_URI, NODE_ENV } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? MONGO_URI : 'mongodb://localhost:27017/newsexpdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

app.use(requestLogger);

app.use(limiter);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(customErrors);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { customErrors } = require('./errors/customErrors');
const router = require('./routes/index');

const app = express();
const { PORT = 3000, MONGO_URI } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(customErrors);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});

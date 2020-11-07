const validator = require('validator');
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Неправильно введен URL!',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Неправильно введен URL!',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    select: false,
  },
})

module.exports = mongoose.model('article', articleSchema);

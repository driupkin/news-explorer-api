const validator = require('validator');
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyWord: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  source: {
    type: Object,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Неправильно введен URL!',
    },
  },
  urlToImage: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Неправильно введен URL!',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);

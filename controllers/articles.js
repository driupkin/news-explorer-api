const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
// GET /articles
const getArticles = (req, res, next) => {
  Article.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
// POST /articles
const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((cards) => res.status(201).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${err.message}`));
      }
      return next(err);
    });
};
// DELETE /articles/articleId
const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Статья с таким id не найдена.');
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then(() => res.status(200).send({ message: 'Статья удалена.' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id.'));
      }
      return next(err);
    });
};

module.exports = { getArticles, createArticle, deleteArticle };

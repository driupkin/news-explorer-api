const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// GET /articles
const getArticles = (req, res, next) => {
  Article.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
// POST /articles
const createArticle = (req, res, next) => {
  const {
    keyWord, title, description, publishedAt, source, url, urlToImage,
  } = req.body;
  Article.create({
    keyWord, title, description, publishedAt, source, url, urlToImage, owner: req.user._id,
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
  Article.findById(req.params.articleId).select('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Статья с таким id не найдена.');
      }
      if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие статьи!');
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

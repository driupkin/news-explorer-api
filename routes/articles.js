const router = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const { validationCreateArticle, validationDelArticle } = require('../middlewares/requestValidation');

router.get('/articles', getArticles);
router.post('/articles', validationCreateArticle, createArticle);
router.delete('/articles/:articleId', validationDelArticle, deleteArticle);

module.exports = router;

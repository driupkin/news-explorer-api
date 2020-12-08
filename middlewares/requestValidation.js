const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Неправильно введен адрес почты!'),
    password:
      Joi.string()
        .required()
        .min(8)
        .message('Пароль должен содержать минимум 8 символов.')
        .max(30)
        .message('Пароль не должен превышать 30 символов.')
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])'))
        .message('Пароль не удовлетворяет требованиям безопасности!'),
    name:
      Joi.string()
        .required()
        .min(2)
        .max(30),
  }).unknown(true),
});

const validationCreateArticle = celebrate({
  body: Joi.object().keys({
    keyWord: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    publishedAt: Joi.string().required(),
    source: Joi.object().required(),
    url: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('неправильно введен URL!');
    }),
    urlToImage: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('неправильно введен URL!');
    }),
    owner: Joi.object(),
  }).unknown(true),
});

const validationDelArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
});

const validationGetUser = celebrate({
  headers: Joi.object().keys({
    Authorization: Joi.string().token(),
  }).unknown(true),
});

module.exports = {
  validationCreateUser,
  validationCreateArticle,
  validationDelArticle,
  validationGetUser,
};

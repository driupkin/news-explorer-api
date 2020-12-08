const reteLimit = require('express-rate-limit');

module.exports.limiter = reteLimit({
  windowMs: 5 * 1000,
  max: 100,
  message: 'Превышено количество запросов с одного IP, попробуйте позже.',
});

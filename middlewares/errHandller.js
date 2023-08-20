const { serverErr } = require('../utils/constants');

const errHandller = (err, req, res, next) => {
  const { statusCode = serverErr, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === serverErr
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = errHandller;

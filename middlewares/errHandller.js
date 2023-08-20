const { serverErr } = require('../utils/constants');

const errHandller = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = serverErr, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === serverErr
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = errHandller;

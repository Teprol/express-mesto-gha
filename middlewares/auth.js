// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const NoAuthError = require('../errors/NoAuthError');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw next(new NoAuthError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw next(new NoAuthError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = auth;

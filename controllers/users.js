const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
// const { serverErr, notFound, badRequest } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const DataAlready = require('../errors/DataAlready');

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserId = (req, res, next) => {
  userModel.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный id'));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Пароль и почта не могут быть пустыми'));
  }

  bcrypt.hash(password, 10).then((hash) => {
    userModel
      .create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
      .then((newUser) => {
        // выведем все кроме пароля
        res.send({
          name: newUser.name, about: newUser.about, avatar: newUser.avatar, email: newUser.email,
        });
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError('Переданы некоректные данные при создании пользователя'));
        } else if (err.code === 11000) {
          next(new DataAlready('Пользователь с таким email уже зарегистрирован'));
        }
        next(err);
      });
  });
};

const updateMeProfile = (req, res, next) => {
  const { _id: id } = req.user;
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении информации о пользователе'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else {
        next(err);
      }
    });
};

const updateMeAvatar = (req, res, next) => {
  const { _id: id } = req.user;
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Передан некорректный url'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создали токен, пейлоуд токена это айди пользователя в бд, токен на 7дней
      //! создать крипто ключ в секретку
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // проверка на получение токена при логине
      // res.send({ token });

      // передача в куки токена
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      return res.send({ token });
    })
    .catch(next);
};

const getUserProfile = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateMeProfile,
  updateMeAvatar,
  login,
  getUserProfile,
};

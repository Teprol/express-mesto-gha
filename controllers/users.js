const mongoose = require('mongoose');
const userModel = require('../models/user');
const { serverErr, notFound, badRequest } = require('../utils/constants');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(serverErr).send({ message: 'Ошибка на сервере' });
    });
};

const getUserId = (req, res) => {
  userModel
    .findById(req.params.userId)
    .orFail()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequest).send({ message: 'Некорректный id' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateMeProfile = (req, res) => {
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
        res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении информации о пользователе' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateMeAvatar = (req, res) => {
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
        res.status(badRequest).send({ message: 'Передан некорректный url' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateMeProfile,
  updateMeAvatar,
};

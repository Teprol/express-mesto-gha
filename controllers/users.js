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
    .then((users) => {
      if (!users) {
        Promise.reject();
      }
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Такого пользователя нет' });
      } else {
        res.status(serverErr).send({ message: 'Ошибка на сервере' });
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
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Введены некоректные данные' });
      } else {
        res.status(serverErr).send({ message: 'Ошибка на сервере' });
      }
    });
};

const updateMeProfile = (req, res) => {
  const { _id: id } = req.user;
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) {
        Promise.reject();
      }
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Такого пользователя нет' });
      } else if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Введены некоректные данные' });
      } else {
        res.status(serverErr).send({ message: 'Ошибка на сервере' });
      }
    });
};

const updateMeAvatar = (req, res) => {
  const { _id: id } = req.user;
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) {
        Promise.reject();
      }
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Такого пользователя нет' });
      } else if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Введены некоректные данные' });
      } else {
        res.status(serverErr).send({ message: 'Ошибка на сервере' });
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

const cardModel = require('../models/card');
const { serverErr, notFound, badRequest } = require('../utils/constants');

const getCards = (req, res) => {
  cardModel
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(serverErr).send({ message: 'Ошибка на сервере' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  cardModel
    .create({ name, link, owner: _id })
    .then((card) => {
      cardModel
        .findById(card._id)
        .populate('owner')
        .then((cardById) => {
          if (!cardById) {
            Promise.reject();
          }
          res.send(cardById);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res
              .status(notFound)
              .send({ message: 'Карточка с указаным ID не найдена' });
          } else {
            res.status(serverErr).send({ message: 'Ошибка на сервере' });
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Введены некоректные данные' });
      } else {
        res.status(serverErr).send({ message: 'Ошибка на сервере' });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        if (!card) {
          Promise.reject();
        }
        res.send({ message: 'Карточка удалена' });
        return;
      }
      res.send({ message: 'Карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(notFound)
          .send({ message: 'Карточка с указаным ID не найдена' });
      } else {
        res.status(serverErr).send({ message: 'Ошибка на сервере' });
      }
    });
};

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((newArrLikes) => {
      if (!newArrLikes) {
        Promise.reject();
      }
      res.send(newArrLikes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(notFound)
          .send({ message: 'Карточка с указаным ID не найдена' });
      } else if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Введены некоректные данные' });
      } else {
        res.status(serverErr).send({ message: 'Ошибка на сервере' });
      }
    });
};

const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((newArrLikes) => {
      if (!newArrLikes) {
        Promise.reject();
      }
      res.send(newArrLikes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(notFound)
          .send({ message: 'Карточка с указаным ID не найдена' });
      } else if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Введены некоректные данные' });
      } else {
        res.status(serverErr).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

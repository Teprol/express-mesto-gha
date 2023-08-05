const mongoose = require('mongoose');
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
      res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
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
        .orFail()
        .populate('owner')
        .then((cardById) => {
          res.send(cardById);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            res
              .status(notFound)
              .send({ message: 'Карточка с указанным id не найдена' });
          } else {
            res
              .status(serverErr)
              .send({ message: 'На сервере произошла ошибка' });
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(badRequest)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      } else {
        res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequest).send({ message: 'Некорректный id' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
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
    .orFail()
    .then((newArrLikes) => {
      res.send(newArrLikes);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequest).send({ message: 'Некорректный id' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
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
    .orFail()
    .then((newArrLikes) => {
      res.send(newArrLikes);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequest).send({ message: 'Некорректный id' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(serverErr).send({ message: 'На сервере произошла ошибка' });
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

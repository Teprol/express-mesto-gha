const express = require('express');
const mongoose = require('mongoose');
const usersRout = require('./routes/users');
const cardsRout = require('./routes/cards');
const { serverErr } = require('./utils/constants');

const app = express();

const { PORT = 3000, dbUrl = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64cacaea8e92546f088c08e6',
  };

  next();
});

app.use('/users', usersRout);
app.use('/cards', cardsRout);
app.use('/*', (req, res) => {
  res.status(serverErr).json({
    message: 'Страница не найдена',
  });
});

app.listen(PORT);

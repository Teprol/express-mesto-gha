const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const usersRout = require('./routes/users');
const cardsRout = require('./routes/cards');
const authRout = require('./routes/auth');
const auth = require('./middlewares/auth');
const errHandller = require('./middlewares/errHandller');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000, dbUrl = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});

// парсер для куки, они теперь доступны в заголовках req.cookies
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// роуты регестрации
app.use('/', authRout);
// роут авторизация
app.use(auth);

app.use('/users', usersRout);
app.use('/cards', cardsRout);
app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
// центр. обработка ошибок
app.use(errors());
app.use(errHandller);

app.listen(PORT);

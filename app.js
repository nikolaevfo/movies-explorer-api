const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./limiter');

const errorsMiddleware = require('./middlewares/errors');

const { PORT = 3000, MONGO_SERVER = 'mongodb://localhost:27017/moviesdb' } = process.env;

mongoose.connect(MONGO_SERVER, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(cookieParser());

const corsOptions = {
  origin: [
    'http://localhost:3000',
    // 'http://nikolaevfo.movies.nomoredomains.icu',
    // 'https://nikolaevfo.movies.nomoredomains.icu',
  ],
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin'],
  credentials: true,
};
app.use('*', cors(corsOptions));

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorsMiddleware);

app.listen(PORT);

const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
// const rateLimit = require('express-rate-limit');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./limiter');

const errorsText = require('./utils/constants');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, MONGO_SERVER } = process.env;

mongoose.connect(MONGO_SERVER, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(cookieParser());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 1000,
// });

const corsOptions = {
  origin: [
    'http://localhost:3000',
    // 'http://nikolaev.student.nomoredomains.club',
    // 'https://nikolaev.student.nomoredomains.club',
  ],
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin'],
  credentials: true,
};
app.use('*', cors(corsOptions));

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());

app.use(requestLogger);
app.use(router);
app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? errorsText.other[500]
        : message,
    });
  next();
});

app.listen(PORT);

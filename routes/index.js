const router = require('express').Router();
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');

const { createUser, login, signout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

const errorsText = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

router.use(cookieParser());
router.use(auth);

router.post('/signout', signout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', () => {
  throw new NotFoundError(errorsText.other[404]);
});

module.exports = router;

const router = require('express').Router();
const cookieParser = require('cookie-parser');
// const { celebrate, Joi } = require('celebrate');

// const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

// router.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().regex(/^https?:\/\/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/),
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(6),
//   }),
// }), createUser);
// router.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(6),
//   }),
// }), login);

router.use(cookieParser());
router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;

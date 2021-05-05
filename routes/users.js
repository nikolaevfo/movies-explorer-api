const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser, getUser,
  // getUsers, getUserById,  updateAvatar,
} = require('../controllers/users');

// router.get('/', getUsers);

router.get('/me', getUser);

// router.get('/:id', celebrate({
//   params: Joi.object().keys({
//     id: Joi.string().required().hex().length(24),
//   }),
// }), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = router;

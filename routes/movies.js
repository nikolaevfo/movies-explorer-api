const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies, createMovie, deleteMovie,
  // getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/movies');
// const regex = new RegExp('^https?:\/\/w?w?w?\.?[-\w.~:/?#[\]@!$&\'()*+,;=]{2,256}#?');

router.get('/', getMovies);

router.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().regex(/^https?:\/\/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/),
    trailer: Joi.string().required().regex(/^https?:\/\/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
    thumbnail: Joi.string().required().regex(/^https?:\/\/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/),
    movieId: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

// router.put('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().required().hex().length(24),
//   }),
// }), likeCard);

// router.delete('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().required().hex().length(24),
//   }),
// }), dislikeCard);

module.exports = router;

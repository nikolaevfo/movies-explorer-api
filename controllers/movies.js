const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/req-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    }, (err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Ошибка валидации');
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемый фильм не найден');
      }

      if (movie.owner.toString() === req.user._id.toString()) {
        movie.findByIdAndRemove(id)
          .then((delMovie) => res.send(delMovie))
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не можете удалить не свой фильм');
      }
    }, (err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Запрашиваемый фильм не найден');
      } else if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

// const likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Запрашивая карточка не найдена');
//       }
//       res.send(card);
//     }, (err) => {
//       if (err.message === 'NotValidId') {
//         throw new NotFoundError('Запрашивая карточка не найдена');
//       } else if (err.name === 'CastError') {
//         throw new RequestError('Переданы некорректные данные');
//       } else if (err.name === 'ValidationError') {
//         throw new RequestError('Ошибка валидации');
//       }
//     })
//     .catch(next);
// };

// const dislikeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Запрашивая карточка не найдена');
//       }
//       res.send(card);
//     }, (err) => {
//       if (err.message === 'NotValidId') {
//         throw new NotFoundError('Запрашивая карточка не найдена');
//       } else if (err.name === 'CastError') {
//         throw new RequestError('Переданы некорректные данные');
//       } else if (err.name === 'ValidationError') {
//         throw new RequestError('Ошибка валидации');
//       }
//     })
//     .catch(next);
// };

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
  // getCards,
  // createCard,
  // deleteCard,
  // likeCard,
  // dislikeCard,
};

const Movie = require('../models/movie');

const errorsText = require('../utils/constants');
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
        throw new RequestError(errorsText.movieCreate.validationError);
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(errorsText.movieDelete.notFoundError);
      }

      if (movie.owner.toString() === req.user._id.toString()) {
        movie.remove();
        res.send(movie);
      } else {
        throw new ForbiddenError(errorsText.movieDelete.forbiddenError);
      }
    }, (err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(errorsText.movieDelete.notFoundError);
      } else if (err.name === 'CastError') {
        throw new RequestError(errorsText.movieDelete.requestError);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/req-err');
const AuthError = require('../errors/auth-err');
const MongoError = require('../errors/mongo-err');

// const getUsers = (req, res, next) => {
//   User.find({})
//     .then((users) => res.send(users))
//     .catch(next);
// };

// const getUserById = (req, res, next) => {
//   const { id } = req.params;
//   User.findById(id)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Запрашиваемый пользователь не найден');
//       }
//       res.send(user);
//     }, (err) => {
//       if (err.message === 'NotValidId') {
//         throw new NotFoundError('Запрашиваемый пользователь не найден');
//       } else if (err.name === 'CastError') {
//         throw new RequestError('Переданы некорректные данные');
//       }
//     })
//     .catch(next);
// };

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    }, (err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const data = { ...req.body };
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    }, (err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные');
      } else if (err.name === 'ValidationError') {
        throw new RequestError('Ошибка валидации');
      }
    })
    .catch(next);
};
/*
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new MongoError('Пользователь уже существует');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              name, about, avatar, email, password: hash,
            })
              .then((newUser) => {
                if (!newUser) {
                  throw new RequestError('Ошибка валидации');
                }
                const sendUser = {
                  name: newUser.name,
                  about: newUser.about,
                  avatar: newUser.avatar,
                  email: newUser.email,
                };
                res.status(201).send({ user: sendUser });
              })
              .catch(next);
          });
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          const sendUser = {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          };
          res
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: 'None',
              secure: true,
            })
            .status(200).send({ user: sendUser });
        })
        .catch(next);
    })
    .catch(next);
};
*/
module.exports = {
  // getUsers,
  // getUserById,
  // createUser,
  updateUser,
  // updateAvatar,
  // login,
  getUser,
};

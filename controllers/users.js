const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const errorsText = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/req-err');
const AuthError = require('../errors/auth-err');
const MongoError = require('../errors/mongo-err');

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorsText.getUser.notFoundError);
      }
      res.send(user);
    }, (err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(errorsText.getUser.notFoundError);
      } else if (err.name === 'CastError') {
        throw new RequestError(errorsText.getUser.validationError);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const data = { ...req.body };
  const { email } = data;
  User.findOne({ email })
    .then((userWithEmail) => {
      if (userWithEmail && (req.user._id.toString() !== userWithEmail._id.toString())) {
        throw new MongoError(errorsText.editProfile.alreadyEmailError);
      }
      User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
        .then((user) => {
          if (!user) {
            throw new NotFoundError(errorsText.editProfile.notFoundError);
          }
          res.send(user);
        })
        .catch(next);
    }, (err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(errorsText.editProfile.notFoundError);
      } else if (err.name === 'CastError') {
        throw new RequestError(errorsText.editProfile.reqError);
      } else if (err.name === 'ValidationError') {
        throw new RequestError(errorsText.editProfile.validationError);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new MongoError(errorsText.signup.emailError);
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              name, email, password: hash,
            })
              .then((newUser) => {
                if (!newUser) {
                  throw new RequestError(errorsText.signup.reqError);
                }
                const sendUser = {
                  name: newUser.name,
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
        throw new AuthError(errorsText.signin.emailPasswordError);
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError(errorsText.signin.emailPasswordError);
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          const sendUser = {
            name: user.name,
            email: user.email,
          };
          res
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: 'None',
              secure: NODE_ENV === 'production',
            })
            .status(200).send({ user: sendUser });
        })
        .catch(next);
    })
    .catch(next);
};

const signout = (req, res, next) => {
  Promise.resolve(true)
    .then(() => {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }).send({ message: '?????????? cookie ??????????????' });
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUser,
  login,
  getUser,
  signout,
};

const jwt = require('jsonwebtoken');

const errorsText = require('../utils/constants');
const AuthError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthError(errorsText.signin.wrongTokenError);
  }

  req.user = payload;
  next();
};

module.exports = auth;

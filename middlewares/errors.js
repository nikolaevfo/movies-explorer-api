const errorsText = require('../utils/constants');

const errorsMiddleware = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? errorsText.other[500] + err
        : message,
    });
  next();
};

module.exports = errorsMiddleware;

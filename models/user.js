const mongoose = require('mongoose');

const isEmail = require('validator/lib/isEmail');
const errorsText = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: errorsText.userSchema.emailError,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2, errorsText.userSchema.nameMinLengthError],
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);

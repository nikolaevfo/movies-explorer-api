const errorsText = {
  signin: {
    emailPasswordError: 'Вы ввели неправильный логин или пароль. ',
    noTokenError: 'При авторизации произошла ошибка. Токен не передан или передан не в том формате.',
    wrongTokenError: 'При авторизации произошла ошибка. Переданный токен некорректен.',
  },
  signup: {
    emailError: 'Пользователь с таким email уже существует.',
    reqError: ' При регистрации пользователя произошла ошибка.',
  },
  editProfile: {
    alreadyEmailError: 'Пользователь с таким email уже существует.',
    reqError: 'При обновлении профиля произошла ошибка.',
    notFoundError: 'Запрашиваемый пользователь не найден.',
    validationError: 'Ошибка валидации.',
  },
  getUser: {
    notFoundError: 'Запрашиваемый пользователь не найден.',
    validationError: 'Ошибка валидации.',
  },
  userSchema: {
    emailError: 'Данные должны быть email',
    nameMinLengthError: 'Имя не может быть короче двух символов.',
  },
  movieCreate: {
    validationError: 'Ошибка валидации.',
  },
  movieDelete: {
    notFoundError: 'Запрашиваемый фильм не найден.',
    forbiddenError: 'Вы не можете удалить не свой фильм.',
    requestError: 'Переданы некорректные данные.',
  },
  movieSchema: {
    urlError: 'Данные должны быть ссылкой.',
  },
  other: {
    500: 'На сервере произошла ошибка.',
    404: 'Страница по указанному маршруту не найдена.',
  },
};

module.exports = errorsText;

const { validationResult, body } = require('express-validator');

module.exports = [
  body('roomName', 'Room name must not be empty.')
    .trim()
    .isLength({ max: 64 })
    .withMessage('message must be less than 64 characters long.')
    .escape(),
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ max: 64 })
    .withMessage('password must be less than 64 characters long.')
    .escape(),
  body('passwordConfirmation')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('passwords must match.')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  },
];

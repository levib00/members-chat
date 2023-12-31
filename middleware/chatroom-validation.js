const { validationResult, body } = require('express-validator');

// Export middleware functions for input validation on chatroom creation.
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
    // Store validation results in 'req.ValidationErrors'
    req.ValidationErrors = validationResult(req);
    return next();
  },
];

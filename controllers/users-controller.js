const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

// Display snack create form on GET.
exports.userCreateGet = asyncHandler(async (req, res, next) => {
  // Get all manufacturers and categories, which we can use for adding to our snack.

  res.render('signup_form', {
    title: 'Sign up',
  });
});

// Handle snack create on POST.
exports.userCreatePost = [

  // Validate and sanitize fields.
  body('first_name', 'First name must not be empty.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('first name must be at least 2 characters long.')
    .isLength({ max: 16 })
    .withMessage('first name must be less than 16 characters long.')
    .escape(),
  body('last_name', 'Last name must not be empty.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('last name must be at least 2 characters long.')
    .isLength({ max: 16 })
    .withMessage('last name must be less than 16 characters long.')
    .escape(),
  body('username', 'username must not be empty.')
    .trim()
    .isLength({ min: 8 })
    .withMessage('username must be at least 8 characters long.')
    .isLength({ max: 32 })
    .withMessage('username must be less than 32 characters long.')
    .escape(),
  body('password', 'password must not be empty.')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long.')
    .isLength({ max: 32 })
    .withMessage('password must be less than 32 characters long.')
    .escape(),
  body('passwordConfirmation')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('passwords must match.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      // if err, do something
      // otherwise, store hashedPassword in DB
      if (err) {
        //
      } else {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
          member_status: false,
        });

        if (!errors.isEmpty()) {
          res.render('signup_form', {
            title: 'Sign up',
            user,
            errors: errors.array(),
          });
        } else {
          // Data from form is valid. Save user.
          res.redirect('/');
          await user.save();
        }
      }
    });
  }),
];

exports.userLogInGet = asyncHandler(async (req, res, next) => {
  // Get all manufacturers and categories, which we can use for adding to our snack.
  if (!req.user) {
    res.render('log-in', {
      title: 'Log-in to chat!',
      errors: req.session.messages
        ? req.session.messages[Object.keys(req.session.messages)[Object.keys(req.session.messages)
          .length - 1]]
        : null,
    });
  } else {
    res.redirect('/');
  }
});

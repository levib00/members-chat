/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('../models/users');
const Message = require('../models/messages');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      const match = await bcrypt.compare(password, user.password);
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// Display snack create form on GET.
exports.messagesGet = asyncHandler(async (req, res, next) => {
  // Get all manufacturers and categories, which we can use for adding to our snack.
  let messages;
  if (req.user) {
    messages = Message.findAll().populate('title').populate('content');
  } else {
    messages = await Message.findAll();
  }
  res.render('index', {
    title: 'Sign up',
    messages,
  });
});

exports.createMessagesGet = asyncHandler(async (req, res, next) => {
  // Get all manufacturers and categories, which we can use for adding to our snack.

  res.render('message_create', {
    title: 'Sign up',
  });
});

// Handle snack create on POST.
exports.messageCreatePost = [

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters long.')
    .isLength({ max: 16 })
    .withMessage('Title must be less than 16 characters long.')
    .escape(),
  body('Message', 'Message must not be empty.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('last name must be at least 2 characters long.')
    .isLength({ max: 16 })
    .withMessage('last name must be less than 16 characters long.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const message = new User({
      title: req.body.title,
      content: req.body.content,
      username: req.user.username,
      timestamp: Date.now(),
      member_status: false,
    });

    if (!errors.isEmpty()) {
      res.render('signup_form', {
        title: 'Sign up',
        errors: errors.array(),
        message,
      });
    } else {
      // Data from form is valid. Save message.
      res.redirect('/');
      await message.save();
    }
  }),
];

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Message = require('../models/messages');

exports.messagesGet = asyncHandler(async (req, res, next) => {
  // Display all messages.
  const { user } = req;
  let messages;
  if (!user) { // show different information depending on whether or not user is a member.
    messages = await Message.find()
      .populate('title')
      .populate('content')
      .exec();
  } else {
    messages = await Message.find()
      .populate('title')
      .populate('content')
      .populate('username')
      .populate('timestamp')
      .exec();
  }

  res.render('index', {
    title: 'Send a message.',
    messages,
    user,
  });
});

exports.messageCreateGet = asyncHandler(async (req, res, next) => {
  // Get message create form.

  res.render('message_create', {
    title: 'Sign up',
  });
});

// Handle message create on POST.
exports.messageCreatePost = [

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters long.')
    .escape(),
  body('Message', 'Message must not be empty.')
    .trim()
    .isLength({ max: 300 })
    .withMessage('message must be less than 300 characters long.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      username: req.user._id,
      timestamp: Date.now(),
    });

    if (!errors.isEmpty()) {
      res.render('log-in', {
        title: 'Log-in',
        errors: errors.array(),
        message,
      });
    } else {
      // Data from form is valid. Save message.
      await message.save();
      res.redirect('/');
    }
  }),
];

exports.messageDeletePost = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndRemove(req.body.id);
  res.redirect('/');
});

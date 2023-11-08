const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const Chatroom = require('../models/chatroom');
const User = require('../models/users');

exports.allChatroomsGet = asyncHandler(async (req, res, next) => {
  const chatrooms = await Chatroom.find();
  res.json(chatrooms);
});

exports.oneChatroomGet = asyncHandler(async (req, res, next) => {
  const chatrooms = await Chatroom.findById();
  res.json(chatrooms);
});

exports.createChatroomPost = [
  // Validate and sanitize fields.
  body('roomName', 'Room name must not be empty.')
    .trim()
    .isLength({ max: 64 })
    .withMessage('message must be less than 300 characters long.')
    .escape(),
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ max: 64 })
    .withMessage('password must be less than 64 characters long.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    if (req.token === null) { // TODO: decide if i like return like here or else like above
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (jwtErr, user) => {
      if (jwtErr) {
        res.status(403);
      }
      bcrypt.hash(req.body.password, 10, async (bcryptErr, hashedPassword) => {
        if (bcryptErr) {
          res.status(403);
        }
        const errors = validationResult(req);
        const userObject = await User.findById(user._id)

        //! not sure if this will work with real mongoose
        const chatroom = new Chatroom({
          roomName: req.body.roomName,
          password: hashedPassword,
          isPublic: req.body.isPublic,
          createdBy: userObject,
        });
        if (!errors.isEmpty()) {
          res.status(400).json({
            errors: errors.array(),
            chatroom,
          });
          // Data from form is valid. Save message.
        } else {
          await chatroom.save();
          res.json(chatroom);
        }
      });
    });
  }),
];

exports.deleteChatroom = asyncHandler(async (req, res, next) => {
  if (req.token === null) { // TODO: decide if i like return like here or else like above
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      res.status(403);
    }
    const chatroom = await Chatroom.findById(req.params.chatroomId);

    //! not sure if this will work with real mongoose
    if ((chatroom.createdBy._id === user._id) || user.isAdmin) {
      // Data from form is valid. Save message.
      await Chatroom.findByIdAndRemove(req.params.messageId);
      res.json({ message: 'Chatroom deleted' });
    } else {
      res.status(403).json({ error: 'You need to be the user who sent the message you are trying to delete.' });
    }
  });
});

exports.editChatroom = [

  // Validate and sanitize fields.
  body('roomName', 'Room name must not be empty.')
    .trim()
    .isLength({ max: 64 })
    .withMessage('message must be less than 64 characters long.')
    .isLength({ min: 3 })
    .withMessage('message must be more than 3 characters long.')
    .escape(),
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ max: 64 })
    .withMessage('password must be less than 64 characters long.')
    .isLength({ mni: 8 })
    .withMessage('password must be more than 8 characters long.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    if (req.token === null) { // TODO: decide if i like return like here or else like above
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (jwtErr, user) => {
      if (jwtErr) {
        res.status(403);
      }
      bcrypt.hash(req.body.password, 10, async (bcryptErr, hashedPassword) => {
        if (bcryptErr) {
          res.status(403);
        }
        const errors = validationResult(req);
        const userObject = await User.findById(user._id)
        const oldChatroom = await Chatroom.findById(req.params.chatroomId)
          .populate('createdBy')
          .exec();
        //! not sure if this will work with real mongoose
        if ((oldChatroom.createdBy._id === user._id) || user.isAdmin) {
          const chatroom = new Chatroom({
            roomName: req.body.roomName,
            password: hashedPassword,
            isPublic: req.body.isPublic,
            createdBy: userObject,
            _id: req.params.chatroomId,
          });
          if (!errors.isEmpty()) {
            res.status(400).json({
              errors: errors.array(),
              chatroom,
            });
          } else {
            // Data from form is valid. Save chatroom.
            await chatroom.save();
            res.json(chatroom);
          }
        } else {
          res.status(403).json({ error: 'You need to be the user who created the chatroom you are trying to edit.' });
        }
      });
    });
  }),
];

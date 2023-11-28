const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const Chatroom = require('../models/chatroom');
const User = require('../models/users');

exports.allChatroomsGet = asyncHandler(async (req, res) => {
  const chatrooms = await Chatroom.find()
    .select('-password');
  if (!chatrooms) {
    return res.status(404);
  }
  return res.json(chatrooms);
});

exports.oneChatroomGet = asyncHandler(async (req, res) => {
  const chatroom = await Chatroom.findById(req.params.chatroomId)
    .select('-password');
  if (!chatroom) {
    return res.status(404);
  }
  return res.json(chatroom);
});

exports.createChatroomPost = [
  // Validate and sanitize fields.
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

  // Process request after validation and sanitization.

  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    if (req.token === null) {
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (jwtErr, tokenUser) => {
      if (jwtErr) {
        return res.status(403);
      }
      bcrypt.hash(req.body.password, 10, async (bcryptErr, hashedPassword) => {
        if (bcryptErr) {
          return res.status(403);
        }
        const errors = validationResult(req);
        const userObject = await User.findById(tokenUser._id);

        const newChatroom = new Chatroom({
          roomName: req.body.roomName,
          password: hashedPassword,
          isPublic: req.body.isPublic,
          createdBy: userObject,
        });
        if (!errors.isEmpty()) {
          return res.status(400).json({
            error: errors.array(),
            newChatroom: {
              roomName: newChatroom.roomName,
              isPublic: newChatroom.isPublic,
              createdBy: newChatroom.createdBy,
              _id: newChatroom._id,
            },
          });
          // Data from form is valid. Save message.
        }
        await newChatroom.save();
        return res.json({
          roomName: newChatroom.roomName,
          isPublic: newChatroom.isPublic,
          createdBy: newChatroom.createdBy,
          _id: newChatroom._id,
        });
      });
      return res.status(500).json({ error: 'Something went wrong.' });
    });
    return res.status(500).json({ error: 'Something went wrong.' });
  }),
];

exports.deleteChatroom = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403);
    }
    const chatroom = await Chatroom.findById(req.params.chatroomId);

    if (!chatroom) {
      return res.status(404).json({ error: 'That message was not found.' });
    }
    if ((chatroom.createdBy._id === user._id) || user.isAdmin) {
      // Data from form is valid. Save message.
      await Chatroom.findByIdAndRemove(req.params.messageId);
      return res.json({ message: 'Chatroom deleted' });
    }
    return res.status(403).json({
      error: 'You need to be the user who sent the message you are trying to delete.',
    });
  });
  return res.status(500).json({ error: 'Something went wrong.' });
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
    .escape(),
  body('passwordConfirmation')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('passwords must match.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res) => {
    if (req.token === null) {
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (jwtErr, tokenUser) => {
      if (jwtErr) {
        return res.status(403);
      }
      bcrypt.hash(req.body.password, 10, async (bcryptErr, hashedPassword) => {
        if (bcryptErr) {
          return res.status(403);
        }
        const errors = validationResult(req);
        const userObject = await User.findById(tokenUser._id);
        const oldChatroom = await Chatroom.findById(req.params.chatroomId)
          .populate('createdBy')
          .exec();

        if (!oldChatroom) {
          return res.status(404);
        }

        if (oldChatroom.createdBy._id.equals(userObject._id) || userObject.isAdmin) {
          const newChatroom = new Chatroom({
            roomName: req.body.roomName,
            password: hashedPassword,
            isPublic: req.body.isPublic,
            createdBy: userObject,
            _id: req.params.chatroomId,
          });
          if (!errors.isEmpty()) {
            return res.status(400).json({
              error: errors.array(),
              newChatroom,
            });
          }
          // Data from form is valid. Save chatroom.
          await Chatroom.findByIdAndUpdate(req.params.chatroomId, newChatroom, {});
          return res.json({
            roomName: newChatroom.roomName,
            isPublic: newChatroom.isPublic,
            createdBy: newChatroom.createdBy,
            _id: newChatroom._id,
          });
        }
        return res.status(403).json({ error: 'You need to be the user who created the chatroom you are trying to edit.' });
      });
      return res.status(500).json({ error: 'Something went wrong.' });
    });
    return res.status(500).json({ error: 'Something went wrong.' });
  }),
];

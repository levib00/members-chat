const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Message = require('../models/messages');
const Chatroom = require('../models/chatroom');
const User = require('../models/users');
require('dotenv').config();

exports.messagesGet = asyncHandler(async (req, res, next) => {
  if (req.token === null) {
    res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403);
    } 
    const chatroom = await Chatroom.findById(req.params.chatroomId);
    const currentUser = await User.findById(user._id);
    if (currentUser.chatrooms.includes(chatroom._id) || currentUser.isAdmin) {
      const messages = await Message.find({ roomId: req.params.chatroomId })
        .populate('username')
        .exec();
      res.json({messages, chatroom});
    } else {
      res.status(403).json({ error: 'You need to be an admin or a member of any servers you are trying to read.' });
    }
  });
});

exports.oneMessageGet = asyncHandler(async (req, res, next) => {
  if (req.token === null) {
    res.status(403).json({ error: 'You are not signed in.' });
  } else {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
       return res.status(403);
      }
      const currentUser = await User.findById(user._id);
      const message = await Message.findById(req.params.messageId);
      if (currentUser.isAdmin) {
        res.json({
          message,
        });
      } else if (message.username === user._id) {
        res.json(message);
      } else {
        res.status(403).json({ error: 'You need to be an admin or a member of any servers you are trying to read.' });
      }
    });
  }
});

exports.userMessagesGet = asyncHandler(async (req, res, next) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      res.status(403);
    }
    const message = await Message.find({ username: req.params.userId }); 
    if (user.isAdmin) {
      res.json({ message });
    } else if (req.params.userId === user._id) {
      res.json(message);
    } else {
      res.status(403).json({ error: 'You need to be an admin or the user who\'s message you are trying to get.' });
    }
  });
});

exports.messageDelete = asyncHandler(async (req, res, next) => {
  if (req.token === null) { 
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403);
    }
    const currentUser = await User.findById(user._id)
    const oldMessage = await Message.findById(req.params.messageId)
    .populate('username')
    .exec();

    if ((oldMessage.username._id.equals(user._id)) || currentUser.isAdmin) {
      // Data from form is valid. Save message.
      await Message.findByIdAndRemove(req.params.messageId);
      res.json({ message: 'message deleted' });
    } else {
      res.status(403).json({ error: 'You need to be the user who sent the message you are trying to delete.' });
    }
  });
});

exports.messageEdit = [

  // Validate and sanitize fields.
  body('content', 'Message must not be empty.')
    .trim()
    .isLength({ max: 300 })
    .withMessage('message must be less than 300 characters long.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    if (req.token === null) {
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403);
      }
      const errors = validationResult(req);
      const oldMessage = await Message.findById(req.params.messageId)
        .populate('username')
        .exec();

      if (oldMessage.username._id.equals(user._id)) { 
        const newMessage = new Message({
          content: req.body.content,
          username: oldMessage.username,
          timestamp: oldMessage.timestamp,
          roomId: oldMessage.roomId,
          _id: req.params.messageId,
        });
        if (!errors.isEmpty()) {
          res.status(400).json({
            errors: errors.array(),
            message: newMessage,
          });
        } else {
          // Data from form is valid. Save message.
          await Message.findByIdAndUpdate(req.params.messageId, newMessage, {});
          res.json(newMessage);
        }
      } else {
        res.status(403).json({ error: 'You need to be the user who sent the message you are trying to edit.' });
      }
    });
  }),
];

// Handle message create on POST.
exports.messagePost = [
  // Validate and sanitize fields.
  body('content', 'Message must not be empty.')
    .trim()
    .isLength({ max: 300 })
    .withMessage('message must be less than 300 characters long.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    if (req.token === null) {
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        res.status(403);
      }
      const errors = validationResult(req);

      const chatroom = await Chatroom.findById(req.params.chatroomId);
      const userObject = await User.findById(user._id)

      const message = new Message({
        content: req.body.content,
        username: userObject,
        timestamp: Date.now(),
        roomId: chatroom,
      });
      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
          message,
        });
        // Data from form is valid. Save message.
      } else {
        await message.save();
        res.json(message);
      }
    });
  }),
];

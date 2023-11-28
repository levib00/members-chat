const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const Message = require('../models/messages');
const Chatroom = require('../models/chatroom');
const User = require('../models/users');
require('dotenv').config();

exports.messagesGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403);
    }
    const chatroom = await Chatroom.findById(req.params.chatroomId);
    const currentUser = await User.findById(user._id);
    if (!currentUser || !chatroom) {
      return res.status(404).json('That chatroom does not exist. please ensure the url you typed is correct.');
    }
    if (currentUser.chatrooms.includes(chatroom._id) || currentUser.isAdmin) {
      const messages = await Message.find({ roomId: req.params.chatroomId })
        .populate('username')
        .exec();
      return res.json({ messages, chatroom });
    }
    return res.status(403).json({ error: 'You need to be an admin or a member of any servers you are trying to read.' });
  });
});

exports.oneMessageGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403);
    }
    const currentUser = await User.findById(user._id);
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404);
    }
    if (currentUser.isAdmin) {
      return res.json({
        message,
      });
    }
    if (message.username === user._id) {
      return res.json(message);
    }
    return res.status(403).json({ error: 'You need to be an admin or a member of any servers you are trying to read.' });
  });
  return res.status(500).json({ error: 'Something went wrong.' });
});

exports.userMessagesGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403);
    }
    const message = await Message.find({ username: req.params.userId });
    if (user.isAdmin) {
      return res.json(message);
    }
    if (req.params.userId === user._id) {
      return res.json(message);
    }
    return res.status(403).json({ error: 'You need to be an admin or the user who\'s message you are trying to get.' });
  });
  return res.status(500).json({ error: 'Something went wrong.' });
});

exports.messageDelete = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403);
    }
    const currentUser = await User.findById(user._id);
    const oldMessage = await Message.findById(req.params.messageId)
      .populate('username')
      .exec();

    if (!oldMessage) {
      return res.status(404);
    }
    if ((oldMessage?.username._id.equals(user._id)) || currentUser.isAdmin) {
      // Data from form is valid. Save message.
      await Message.findByIdAndRemove(req.params.messageId);
      return res.json({ _id: oldMessage._id, message: 'message was deleted.' });
    }
    return res.status(403).json({ error: 'You need to be the user who sent the message you are trying to delete.' });
  });
  return res.status(500).json({ error: 'Something went wrong.' });
});

exports.messageEdit = [

  // Validate and sanitize fields.
  body('content', 'Message must not be empty.')
    .trim()
    .isLength({ max: 300 })
    .withMessage('message must be less than 300 characters long.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res) => {
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

      if (!oldMessage) {
        return res.status(404);
      }

      if (oldMessage.username._id.equals(user._id)) {
        const newMessage = new Message({
          content: req.body.content,
          username: oldMessage.username,
          timestamp: oldMessage.timestamp,
          roomId: oldMessage.roomId,
          _id: req.params.messageId,
        });
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: newMessage,
          });
        }
        // Data from form is valid. Save message.
        await Message.findByIdAndUpdate(req.params.messageId, newMessage, {});
        return res.json(newMessage);
      }
      return res.status(403).json({ error: 'You need to be the user who sent the message you are trying to edit.' });
    });
    return res.status(500).json({ error: 'Something went wrong.' });
  }),
];

// Handle message create on POST.
exports.messagePost = [
  // Validate and sanitize fields.
  body('content', 'Message must not be empty.')
    .trim()
    .isLength({ max: 300 })
    .withMessage('Message must be less than 300 characters long.')
    .isLength({ min: 1 })
    .withMessage('Message must be more than 1 character long.')
    .escape(),
  body('_id'),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res) => {
    function isObjectIdValid(id) {
      if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) {
          return true;
        }
        return false;
      }
      return false;
    }
    // Extract the validation errors from a request.
    if (req.token === null) {
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    if (req.body._id) {
      if (!isObjectIdValid(req.body._id)) {
        return res.status(400).json({ error: 'Something went wrong. Invalid ObjectId.' });
      }
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403);
      }
      const errors = validationResult(req);

      const chatroom = await Chatroom.findById(req.params.chatroomId);
      const userObject = await User.findById(user._id);

      const message = new Message({
        content: req.body.content,
        username: userObject,
        timestamp: Date.now(),
        roomId: chatroom,
        _id: req.body._id || new ObjectId(),
      });
      if (!errors.isEmpty()) {
        // TODO: change errors to error in these functions. also maybe make it a helper.
        return res.status(400).json({
          error: errors.array(),
          message,
        });
        // Data from form is valid. Save message.
      }
      await message.save();
      return res.json(message);
    });
    return res.status(500).json({ error: 'Something went wrong.' });
  }),
];

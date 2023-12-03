const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { ObjectId } = require('mongoose').Types;
const Message = require('../models/messages');
const Chatroom = require('../models/chatroom');
const User = require('../models/users');
require('dotenv').config();

const createNewMessageObject = (currentUser, updateFields) => {
  const {
    content,
    username,
    timestamp,
    roomId,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _id: id,
  } = currentUser;

  const newMessage = new Message({
    content,
    username,
    timestamp,
    roomId,
    ...updateFields,
    id,
  });
  return newMessage;
};

exports.messagesGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    res.status(403).json({ error: 'You are not signed in.' });
  }
  const chatroom = await Chatroom.findById(req.params.chatroomId);
  const currentUser = await User.findById(req.user._id);
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

exports.oneMessageGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  const currentUser = await User.findById(req.user._id);
  const message = await Message.findById(req.params.messageId);
  if (!message) {
    return res.status(404);
  }
  if (currentUser.isAdmin) {
    return res.json({
      message,
    });
  }
  if (message.username === req.user._id) {
    return res.json(message);
  }
  return res.status(403).json({ error: 'You need to be an admin or a member of any servers you are trying to read.' });
});

exports.userMessagesGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  const message = await Message.find({ username: req.params.userId });
  if (req.user.isAdmin) {
    return res.json(message);
  }
  if (req.params.userId === req.user._id) {
    return res.json(message);
  }
  return res.status(403).json({ error: 'You need to be an admin or the user who\'s message you are trying to get.' });
});

exports.messageDelete = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  const currentUser = await User.findById(req.user._id);
  const oldMessage = await Message.findById(req.params.messageId)
    .populate('username')
    .exec();

  if (!oldMessage) {
    return res.status(404);
  }
  if ((oldMessage?.username._id.equals(req.user._id)) || currentUser.isAdmin) {
    // Data from form is valid. Save message.
    await Message.findByIdAndRemove(req.params.messageId);
    return res.json({ _id: oldMessage._id, message: 'message was deleted.' });
  }
  return res.status(403).json({ error: 'You need to be the user who sent the message you are trying to delete.' });
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
    const errors = validationResult(req);
    const oldMessage = await Message.findById(req.params.messageId)
      .populate('username')
      .exec();

    if (!oldMessage) {
      return res.status(404);
    }

    if (oldMessage.username._id.equals(req.user._id)) {
      const newMessage = createNewMessageObject(oldMessage, req.body);

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
    const errors = validationResult(req);

    const chatroom = await Chatroom.findById(req.params.chatroomId);
    const userObject = await User.findById(req.user._id);

    const message = createNewMessageObject({
      content: req.body.content,
      username: userObject,
      timestamp: Date.now(),
      roomId: chatroom,
      _id: req.body._id || new ObjectId(),
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
        message,
      });
      // Data from form is valid. Save message.
    }
    await message.save();
    return res.json(message);
  }),
];

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Chatroom = require('../models/chatroom');
const User = require('../models/users');

// Function to create a new chatroom object
const createNewChatroomObject = (currentUser, updateFields) => {
  // Destructure needed properties from currentUser
  const {
    roomName,
    password,
    passwordConfirmation,
    isPublic,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _id: id,
  } = currentUser;

  // Create a new Chatroom object with given properties
  const newChatroom = new Chatroom({
    roomName,
    password,
    passwordConfirmation,
    isPublic,
    ...updateFields,
    id,
  });
  return newChatroom;
};

// Get all chatrooms
exports.allChatroomsGet = asyncHandler(async (req, res) => {
  const chatrooms = await Chatroom.find()
    .select('-password');
  if (!chatrooms) {
    return res.status(404);
  }
  return res.json(chatrooms);
});

// Get a single chatroom by ID
exports.oneChatroomGet = asyncHandler(async (req, res) => {
  const chatroom = await Chatroom.findById(req.params.chatroomId)
    .select('-password');
  if (!chatroom) {
    return res.status(404);
  }
  return res.json(chatroom);
});

// Create a new chatroom
exports.createChatroomPost = asyncHandler(async (req, res) => {
  // Extract the validation errors from a request.
  if (req.user === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  if (!req.ValidationErrors.isEmpty()) {
    return res.status(400).json({ errors: req.ValidationErrors.array() });
  }
  return bcrypt.hash(req.body.password, 10, async (bcryptErr, hashedPassword) => {
    // Handling bcrypt hashing error
    if (bcryptErr) {
      return res.status(403);
    }
    const user = await User.findById(req.user._id);

    const newChatroom = createNewChatroomObject(
      req.body,
      { password: hashedPassword, createdBy: user },
    );
    await newChatroom.save();
    return res.json(newChatroom);
  });
});

// Delete a chatroom by ID
exports.deleteChatroom = asyncHandler(async (req, res) => {
  if (req.user === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  const chatroom = await Chatroom.findById(req.params.chatroomId);

  if (!chatroom) {
    return res.status(404).json({ error: 'That message was not found.' });
  }
  if ((chatroom.createdBy._id === req.user._id) || req.user.isAdmin) {
    // Data from form is valid. Save message.
    await Chatroom.findByIdAndRemove(req.params.messageId);
    return res.json({ message: 'Chatroom deleted' });
  }
  return res.status(403).json({
    error: 'You need to be the user who sent the message you are trying to delete.',
  });
});

// Edit a chatroom by ID
exports.editChatroom = asyncHandler(async (req, res) => {
  if (req.user === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  return bcrypt.hash(req.body.password, 10, async (bcryptErr, hashedPassword) => {
    if (bcryptErr) {
      return res.status(403);
    }

    const user = await User.findById(req.user._id);
    const oldChatroom = await Chatroom.findById(req.params.chatroomId)
      .populate('createdBy')
      .exec();

    if (!oldChatroom) {
      return res.status(404);
    }

    if (oldChatroom.createdBy._id.equals(user._id) || user.isAdmin) {
      if (!req.ValidationErrors.isEmpty()) {
        return res.status(400).json({ errors: req.ValidationErrors.array() });
      }
      const newChatroom = createNewChatroomObject(
        req.body,
        { password: hashedPassword, createdBy: user, _id: req.params.chatroomId },
      );
      // Data from form is valid. Save chatroom.
      await Chatroom.findByIdAndUpdate(req.params.chatroomId, newChatroom, {});
      return res.json(newChatroom);
    }
    return res.status(403).json({ error: 'You need to be the user who created the chatroom you are trying to edit.' });
  });
});

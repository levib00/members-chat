const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Chatroom = require('../models/chatroom');
require('dotenv').config();

const createNewUserObject = (currentUser, updateFields) => {
  const {
    firstName,
    lastName,
    username,
    password,
    chatrooms,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _id,
  } = currentUser;

  const newUser = new User({
    firstName,
    lastName,
    username,
    password,
    chatrooms,
    ...updateFields,
    _id,
  });
  return newUser;
};

const formatUserObject = (newUser) => {
  const { password, ...rest } = newUser;
  return {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    ...rest,
  };
};

const jwtSign = (newUser, res) => {
  const userObject = formatUserObject(newUser);
  return new Promise((resolve) => {
    jwt.sign(userObject, process.env.JWT_SECRET, (signErr, token) => {
      if (signErr) {
        return res.status(500).json({ error: 'Something went wrong. Check your request and try again.', signErr });
      }
      return resolve(token);
    });
  });
};

exports.allUsersGet = asyncHandler(async (req, res) => {
  // Get all users
  const currentUser = await User.findById(req.user._id);

  if (!currentUser.isAdmin) {
    return res.status(403).send({
      error: 'You must be an admin to see all users.',
    });
  }
  const users = await User.find()
    .select('-password');
  return res.json(users);
});

exports.selfGet = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id)
    .select('-password');
  if (!currentUser) {
    return res.status(404).json({ error: 'The user you\'re trying to find was not found.' });
  }
  return res.json(currentUser);
});

exports.userGet = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    return res.status(404).json({ error: 'The user you\'re trying to find was not found.' });
  }
  if (!currentUser.isAdmin) {
    const user = await User.findById(req.user._id)
      .select('-password')
      .select('-lastName')
      .select('-chatrooms');
    return res.json(user);
  }
  const user = await User.findById(req.user._id)
    .select('-password');
  return res.json(user);
});

exports.userJoinChatroom = [
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ max: 64 })
    .withMessage('password must be less than 64 characters long.')
    .isLength({ min: 8 })
    .withMessage('password must be more than 8 characters long.')
    .escape(),

  asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user._id);

    const chatroom = await Chatroom.findById(req.params.chatroomId);
    if (!currentUser || !chatroom) {
      return res.status(404).json('The chatroom does not exist or your not permitted to join.');
    }
    if (currentUser.chatrooms.includes(chatroom._id)) {
      return res.status(403).json(req.user.chatrooms);
    }
    const match = bcrypt.compare(req.body.password, chatroom.password);
    if (!await match && !currentUser.isAdmin && !chatroom.isPublic) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    const userChatrooms = [...currentUser.chatrooms, chatroom];
    const newUser = createNewUserObject(currentUser, { chatrooms: userChatrooms });

    await User.findByIdAndUpdate(currentUser._id, newUser, {});
    const token = await jwtSign(newUser._doc);
    return res.json({ token, chatroomId: chatroom._id });
  }),
];

exports.userLeaveChatroom = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    return res.status(404);
  }
  const chatroomIndex = currentUser.chatrooms.indexOf(req.params.chatroomId);
  if (chatroomIndex < 0) {
    return res.status(403).json({ error: 'You are not in the chatroom you\'re trying to leave.' });
  }
  currentUser.chatrooms.splice(chatroomIndex, 1);
  const newUser = createNewUserObject(currentUser, null);

  await User.findByIdAndUpdate(req.user._id, newUser, {});
  const token = await jwtSign(newUser._doc);
  return res.json({ token });
});

// Handle user create (sin-up) on POST.
exports.userCreatePost = [
  // Validate and sanitize fields.
  body('firstName', 'First name must not be empty.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('first name must be at least 2 characters long.')
    .isLength({ max: 16 })
    .withMessage('first name must be less than 16 characters long.')
    .escape(),
  body('lastName', 'Last name must not be empty.')
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
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const usernameExists = await User.exists({ username: req.body.username });
    if (!usernameExists) {
      if (req.body.password === req.body.passwordConfirmation) {
        return bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        // otherwise, store hashedPassword in DB
          if (err) {
            return res.json(err);
          }
          const user = createNewUserObject(req.body, { password: hashedPassword, isAdmin: false });

          if (!errors.isEmpty()) {
            return res.json({
              user,
              errors: errors.array(),
            });
          }
          // Data from form is valid. Save user.
          await user.save();
          return res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            isAdmin: user.isAdmin,
          });
        });
      }
      return res.status(403).json({
        error: 'Passwords do not match.',
      });
    }
    return res.status(409).json({ error: 'username already exists' });
  }),
];

exports.makeUserAdmin = asyncHandler(async (req, res) => {
  const newAdmin = await User.findById(req.params.userId);
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'You need to be an admin to make another user an admin.' });
  }
  if (newAdmin.isAdmin) {
    return res.status(403).json({ error: 'This user is already an admin.' });
  }
  const newUser = createNewUserObject(newAdmin, { isAdmin: true });

  await User.findByIdAndUpdate(req.user._id, newUser, {});
  return res.json(newUser);
});

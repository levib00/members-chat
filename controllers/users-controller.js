const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Chatroom = require('../models/chatroom');
require('dotenv').config();

// Display snack create form on GET.

exports.allUsersGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  // Get all users
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.json(err);
    }
    const currentUser = await User.findById(user._id);

    if (!currentUser.isAdmin) {
      return res.status(403).send({
        error: 'Forbidden',
      });
    }
    const users = await User.find()
      .select('-password');
    return res.json(users);
  });
  return res.status(500).json({ error: 'Something went wrong.' });
});

exports.selfGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.json(err);
    }
    const currentUser = await User.findById(user._id)
      .select('-password');
    if (!currentUser) {
      return res.status(404);
    }
    return res.json(currentUser);
  });
  return res.status(500).json({ error: 'Something went wrong.' });
});

exports.userGet = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, jwtUser) => {
    if (err) {
      return res.send(err);
    }
    const currentUser = await User.findById(jwtUser._id);
    if (!currentUser) {
      return res.status(404);
    }
    if (!currentUser.isAdmin) {
      const user = await User.findById(jwtUser._id)
        .select('-password')
        .select('-lastName')
        .select('-chatrooms');
      return res.json(user);
    }
    const user = await User.findById(jwtUser._id)
      .select('-password');
    return res.json(user);
  });
  return res.status(500).json({ error: 'Something went wrong.' });
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
    if (req.token === null) {
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (verifyErr, user) => {
      const currentUser = await User.findById(user._id);
      if (verifyErr) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const chatroom = await Chatroom.findById(req.params.chatroomId);
      if (!currentUser || !chatroom) {
        return res.status(404);
      }
      if (currentUser.chatrooms.includes(chatroom._id)) {
        return res.status(403).json(user.chatrooms);
      }
      const match = bcrypt.compare(req.body.password, chatroom.password);
      if (!await match && !currentUser.isAdmin && !chatroom.isPublic) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
      const userChatrooms = [...currentUser.chatrooms, chatroom];
      const newUser = new User({
        first_name: user.firstName,
        last_name: user.lastName,
        username: user.username,
        password: user.password,
        chatrooms: userChatrooms,
        _id: user._id,
      });

      await User.findByIdAndUpdate(user._id, newUser, {});
      const { password, ...rest } = newUser._doc;
      const updatedUser = await { firstName: user.firstName, lastName: user.lastName, ...rest };
      jwt.sign(updatedUser, process.env.JWT_SECRET, (signErr, token) => {
        if (verifyErr) {
          return res.status(500).json({ error: 'Something went wrong', signErr });
        }
        return res.send({ token, chatroomId: req.params.chatroomId });
      });
      return res.status(500).json({ error: 'Something went wrong.' });
    });
    return res.status(500).json({ error: 'Something went wrong.' });
  }),
];

exports.userLeaveChatroom = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (verifyErr, user) => {
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      return res.status(404);
    }
    if (verifyErr) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const chatroomIndex = currentUser.chatrooms.indexOf(req.params.chatroomId);
    if (chatroomIndex < 0) {
      return res.status(403).json({ error: 'You are not in this chatroom.' });
    }
    currentUser.chatrooms.splice(chatroomIndex, 1);
    const newUser = new User({
      first_name: currentUser.firstName,
      last_name: currentUser.lastName,
      username: currentUser.username,
      password: currentUser.password,
      chatrooms: currentUser.chatrooms,
      _id: currentUser._id,
    });

    await User.findByIdAndUpdate(user._id, newUser, {});
    const { password, ...rest } = newUser._doc;
    const updatedUser = { firstName: user.firstName, lastName: user.lastName, ...rest };
    jwt.sign(updatedUser, process.env.JWT_SECRET, (signErr, token) => {
      if (signErr) {
        return res.status(500).json({ error: 'Something went wrong', signErr });
      }
      return res.send({ token });
    });
    return res.status(500).json({ error: 'Something went wrong.' });
  });
  return res.status(500).json({ error: 'Something went wrong.' });
});

// Handle user create (sign-up) on POST.
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
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        // otherwise, store hashedPassword in DB
          if (err) {
            return res.json(err);
          }
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hashedPassword,
            isAdmin: false,
          });

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
      } else {
        return res.status(403).json({
          error: 'Passwords do not match.',
        });
      }
    } else {
      return res.status(409).json({ error: 'username already exists' });
    }
    return res.status(500).json({ error: 'Something went wrong.' });
  }),
];

exports.makeUserAdmin = asyncHandler(async (req, res) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      res.status(403);
    } else {
      const newAdmin = await User.findById(req.params.userId);
      if (!user.isAdmin) {
        return res.status(403).json({ error: 'You need to be an admin to make another user an admin.' });
      }
      if (newAdmin.isAdmin) {
        return res.status(403).json({ error: 'User is already an admin.' });
      }
      const newUser = new User({
        first_name: newAdmin.firstName,
        last_name: newAdmin.lastName,
        username: newAdmin.username,
        password: newAdmin.password,
        chatrooms: newAdmin.chatrooms,
        isAdmin: true,
        _id: newAdmin._id,
      });

      await User.findByIdAndUpdate(user._id, newUser, {});
      return res.json(newUser);
    }
    return res.status(500).json({ error: 'Something went wrong.' });
  });
  return res.status(500).json({ error: 'Something went wrong.' });
});

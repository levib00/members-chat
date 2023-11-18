const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Chatroom = require('../models/chatroom');
require('dotenv').config();

// Display snack create form on GET.

exports.allUsersGet = asyncHandler(async (req, res, next) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  // Get all users
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      res.send(err);
    } else if (!user.isAdmin) {
      res.status(403).send({
        error: 'Forbidden',
      });
    } else {
      const users = await User.find();
      res.json(users);
    }
  });
});

exports.selfGet = asyncHandler(async (req, res, next) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  // Get all users
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      res.send(err);
    } else {
      const users = await User.findById(user._id);
      res.json(users);
    }// show different information depending on whether or not user is a member.
  });
});

exports.userJoinChatroom = [
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ max: 64 })
    .withMessage('password must be less than 64 characters long.')
    .isLength({ min: 8 })
    .withMessage('password must be more than 8 characters long.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (req.token === null) {
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        res.status(403).json({ error: 'Forbidden' });
      } else {
        const chatroom = await Chatroom.findById(req.params.chatroomId);
        if (user.chatrooms.includes(chatroom._id)) {
          res.status(403).json(user.chatrooms);
        } else {
          const match = bcrypt.compare(req.body.password, chatroom.password);
          if (!await match) {
            return res.status(401).json({ error: 'Incorrect password' });
          } else {
            const userChatrooms = [...user.chatrooms, chatroom];
            const newUser = new User({
              first_name: user.firstName,
              last_name: user.lastName,
              username: user.username,
              password: user.password,
              chatrooms: userChatrooms,
              _id: user._id,
            });

            await User.findByIdAndUpdate(user._id, newUser, {});
            res.json(user.chatrooms);
          }
        }
      }
    });
  }),
]

exports.userLeaveChatroom = asyncHandler(async (req, res, next) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    const thisUser = await User.findById(user._id)
    if (err) {
      res.status(403).json({ error: 'Forbidden' });
    } else {     
      const chatroomIndex = thisUser.chatrooms.indexOf(req.params.chatroomId)
      if (chatroomIndex < 0) {
        return res.status(403).json( { error: 'You are not in this chatroom.' })
      } else {
        thisUser.chatrooms.splice(chatroomIndex, 1);
        const newUser = new User({
          first_name: thisUser.firstName,
          last_name: thisUser.lastName,
          username: thisUser.username,
          password: thisUser.password,
          chatrooms: thisUser.chatrooms,
          _id: thisUser._id,
        });

        await User.findByIdAndUpdate(thisUser._id, newUser, {});
        res.json(thisUser.chatrooms);
      }
    }
  });
}),

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

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const usernameExists = await User.exists({username: req.body.username})
    if (!usernameExists) {
      if (req.body.password === req.body.passwordConfirmation) {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        // otherwise, store hashedPassword in DB
          if (err) {
            return res.json(err);
          } else {
            const user = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username,
              password: hashedPassword,
              member_status: false,
            });
  
            if (!errors.isEmpty()) {
              return res.json({
                user,
                errors: errors.array(),
              });
            } else {
              // Data from form is valid. Save user.
              await user.save();
              return res.json(user);
            }
          }
        });
      } else {
        return res.status(403).json({
          error: 'Passwords do not match.',
        });
      }
    } else {
      res.status(409).json({error: 'username already exists'})
    }
    
  }),
];

exports.makeUserAdmin = asyncHandler(async (req, res, next) => {
  if (req.token === null) {
    return res.status(403).json({ error: 'You are not signed in.' });
  }
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      res.status(403);
    } else {
      const newAdmin = await User.findById(req.params.userId);
      if (!user.isAdmin) {
        res.status(403).json({ error: 'You need to be an admin to make another user an admin.' });
      } else if (newAdmin.isAdmin) {
        res.status(403).json({ error: 'User is already an admin.' });
      } else {
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
        res.json(newUser);
      }
    }
  });
});

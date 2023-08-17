/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const Passphrase = require('../models/passphrase');
const User = require('../models/users');

// Display snack create form on GET.
exports.PassphraseGet = asyncHandler(async (req, res, next) => {
  // Get all manufacturers and categories, which we can use for adding to our snack.

  res.render('passphrase', {
    title: 'passphrase',
  });
});

// Handle snack create on POST.
exports.PassphrasePost = [

  // Validate and sanitize fields.
  body('passphrase', 'First name must not be empty.')
    .isLength({ max: 32 })
    .withMessage('password must be less than 32 characters long.')
    .escape(),
  body('passphraseConfirmation', 'First name must not be empty.')
    .custom((value, { req }) => value === req.body.passphrase)
    .withMessage('passwords must match.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    bcrypt.hash(req.body.passphrase, 10, async (err, hashedPassword) => {
      // if err, do something
      // otherwise, store hashedPassword in DB
      if (err) {
        //
      } else {
        const passphrase = new Passphrase({
          passphrase: hashedPassword,
          member_status: false,
        });

        if (!errors.isEmpty()) {
          res.render('passphrase', {
            title: 'passphrase',
            errors: errors.array(),
          });
        } else {
          // Data from form is valid. Save user.
          res.redirect('/');
          await passphrase.save();
        }
      }
    });
  }),
];

exports.makeMemberGet = asyncHandler(async (req, res, next) => {
  // Get all manufacturers and categories, which we can use for adding to our snack.

  res.render('passphrase', {
    title: 'Become a member!',
  });
});

// Handle update member create on POST.
exports.makeMemberPost = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(req.user);
  const passphrase = await Passphrase.findOne('64dc43252fbaa720a2df4965');
  const match = await bcrypt.compare(req.body.passphrase, passphrase);

  if (!match) {
    res.render('passphrase', {
      title: 'Become a member!',
    });
  } else {
    const member = new User({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      password: user.password,
      member_status: true,
      _id: user._id,
    });

    User.findByIdAndUpdate(user._id, member, {});
  }
});

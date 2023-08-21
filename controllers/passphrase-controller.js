/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const Passphrase = require('../models/passphrase');
const User = require('../models/users');

exports.PassphraseGet = asyncHandler(async (req, res, next) => {
  // Get passphrase enter form.

  res.render('passphrase', {
    title: 'passphrase',
  });
});

exports.makeMemberGet = asyncHandler(async (req, res, next) => {
  // Get member password form.
  res.render('passphrase', {
    title: 'lightning',
  });
});

// Handle update member create on POST.
exports.makeMemberPost = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const passphrase = await Passphrase.findById('64dc43252fbaa720a2df4965');
  const match = await bcrypt.compare(req.body.passphrase, passphrase.passphrase);

  if (!match) {
    res.render('passphrase', {
      title: 'lightning',
      errors: 'Hint: look at the ',
      href: 'https://en.wikipedia.org/wiki/Countersign_(military)',
      link: ' wikipedia page for countersigns',
      action: '/users/become-admin',
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

    await User.findByIdAndUpdate(user._id, member, {});
    res.redirect('/');
  }
});

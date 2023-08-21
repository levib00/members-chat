const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const User = require('../models/users');

exports.makeAdminGet = asyncHandler(async (req, res, next) => {
  // Get admin password page.
  res.render('passphrase', {
    title: 'Become a admin!',
  });
});

// Handle update admin create on POST.
exports.makeAdminPost = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const admin = await Admin.findById('64df311971803c18d7552aef');
  const match = await bcrypt.compare(req.body.passphrase, admin.admin);

  if (!match) {
    res.render('passphrase', {
      title: 'Become an admin!',
      errors: 'default admin password.',
      action: '/users/become-admin',
    });
  } else {
    const member = new User({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      password: user.password,
      member_status: true,
      isAdmin: true,
      _id: user._id,
    });

    await User.findByIdAndUpdate(user._id, member, {});
    res.redirect('/');
  }
});

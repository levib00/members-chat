const express = require('express');

const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users-controller');
const passphraseController = require('../controllers/passphrase-controller');
const adminController = require('../controllers/admin-controller');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.redirect('/');
});

router.get('/sign-up', usersController.userCreateGet);

router.post('/sign-up', usersController.userCreatePost);

router.get('/become-member', passphraseController.makeMemberGet);

router.post('/become-member', passphraseController.makeMemberPost);

router.get('/log-in', usersController.userLogInGet);

router.post('/log-in', passport.authenticate('local', {
  failureRedirect: '/users/log-in',
  failureMessage: true,
}), (req, res) => {
  res.redirect('/');
});

router.get('/become-admin', adminController.makeAdminGet);

router.post('/become-admin', adminController.makeAdminPost);

module.exports = router;

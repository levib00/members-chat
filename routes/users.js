const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users-controller');
const passphraseController = require('../controllers/passphrase-controller');

/* GET users listing. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.redirect('/');
});

router.get('/sign-up', usersController.userCreateGet);

router.post('/sign-up', usersController.userCreatePost);

router.get('/create-member', passphraseController.makeMemberGet);

router.post('/create-member', passphraseController.makeMemberPost);

router.post('/log-in', usersController.userLogInGet);

router.post('/log-in', usersController.userLogInPost);

module.exports = router;

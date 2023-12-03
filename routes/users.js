const express = require('express');

const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const usersController = require('../controllers/users-controller');
const verifyToken = require('../middleware/verify-token');

/* GET users listing. */
router.get('/', verifyToken, usersController.allUsersGet);

router.get('/user', verifyToken, usersController.selfGet);

// router.get('/user/userId', verifyToken, usersController.userGet);

router.post('/sign-up', usersController.userCreatePost);

router.post('/join/:chatroomId', verifyToken, usersController.userJoinChatroom);

router.post('/leave/:chatroomId', verifyToken, usersController.userLeaveChatroom);

router.put('/:userId', verifyToken, usersController.makeUserAdmin);

router.post('/log-in', passport.authenticate('local', {
  failureMessage: true,
}), (req, res) => {
  const { password, ...rest } = req.user._doc;
  jwt.sign(rest, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      return res.status(500).json({ error: 'Something went wrong', err });
    }
    return res.send({ token });
  });
});

router.post('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/');
  });
});

module.exports = router;

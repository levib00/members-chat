const express = require('express');

const router = express.Router();
const messagesController = require('../controllers/messages-controller');

// GET messageCreatePosts listing.
router.get('/', (req, res, next) => {
  res.redirect('/');
});

router.get('/new', messagesController.messageCreateGet);

router.post('/new', messagesController.messageCreatePost);

router.post('/delete', messagesController.messageDeletePost);

module.exports = router;

const express = require('express');

const router = express.Router();
const messagesController = require('../controllers/messages-controller');

/* GET users listing. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.redirect('/');
});

router.get('/new', messagesController.userCreateGet);

router.post('/new', messagesController.userCreatePost);

module.exports = router;

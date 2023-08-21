const express = require('express');
const messagesController = require('../controllers/messages-controller');

const router = express.Router();

/* GET home page. */
router.get('/', messagesController.messagesGet);

module.exports = router;

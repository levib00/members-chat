const express = require('express');

const router = express.Router();
const messagesController = require('../controllers/messages-controller');
const verifyToken = require('../middleware/verify-token');

router.get('/', verifyToken, messagesController.messagesGet);

router.get('/chatroom/:chatroomId', verifyToken, messagesController.messagesGet);

router.get('/:messageId', verifyToken, messagesController.oneMessageGet);

router.get('/user/:userId', verifyToken, messagesController.userMessagesGet);

router.delete('/delete/:messageId', verifyToken, messagesController.messageDelete);

router.put('/edit/:messageId', verifyToken, messagesController.messageEdit);

router.post('/:chatroomId', verifyToken, messagesController.messagePost);

module.exports = router;

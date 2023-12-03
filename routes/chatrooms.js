const express = require('express');

const router = express.Router();
const chatroomsController = require('../controllers/chatrooms-controller');
const verifyToken = require('../middleware/verify-token');
const validateChatroom = require('../middleware/chatroom-validation');

router.get('/', chatroomsController.allChatroomsGet);

router.get('/:chatroomId', chatroomsController.oneChatroomGet);

router.post('/new', verifyToken, validateChatroom, chatroomsController.createChatroomPost);

router.delete('/delete/:chatroomId', verifyToken, chatroomsController.deleteChatroom);

router.put('/edit/:chatroomId', verifyToken, validateChatroom, chatroomsController.editChatroom);

module.exports = router;

const express = require('express');

const router = express.Router();
const chatroomsController = require('../controllers/chatrooms-controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', chatroomsController.allChatroomsGet);

router.get('/:chatroomId', chatroomsController.oneChatroomGet);

router.post('/new', verifyToken, chatroomsController.createChatroomPost);

router.delete('/delete/:chatroomId', verifyToken, chatroomsController.deleteChatroom);

router.put('/edit/:chatroomId', verifyToken, chatroomsController.editChatroom);

module.exports = router;

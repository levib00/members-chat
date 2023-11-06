const express = require('express');

const router = express.Router();
const chatroomsController = require('../controllers/chatrooms-controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, chatroomsController.allChatroomsGet);

router.post('/new', chatroomsController.createChatroomPost);

router.delete('/:chatroomId/delete', chatroomsController.deleteChatroom);

router.put('/:chatroomId/edit', chatroomsController.editChatroom);

module.exports = router;

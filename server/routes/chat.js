const express = require('express');
const router = express.Router();
const { getMessages, getChatRoomDetails } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:roomId', protect, getChatRoomDetails);
router.get('/:roomId/messages', protect, getMessages);

module.exports = router;
const ChatRoom = require('../models/ChatRoom');

// @desc    Get all messages for a specific chat room
// @route   GET /api/chats/:roomId/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.roomId)
      .populate('participants', 'name profilePictureUrl')
      .populate('messages.sender', 'name profilePictureUrl'); // Populate sender's info

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Ensure the requesting user is a participant of the chat room
    const isParticipant = chatRoom.participants.some(participant =>
      participant._id.equals(req.user._id)
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'User is not a participant of this chat' });
    }

    res.json(chatRoom.messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// In chatController.js
exports.getChatRoomDetails = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.roomId).populate('participants', 'name profilePictureUrl');
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
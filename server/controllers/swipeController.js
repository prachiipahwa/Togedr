const Swipe = require('../models/Swipe');
const Activity = require('../models/Activity');
const ChatRoom = require('../models/ChatRoom');

// @desc    Submit a swipe decision and check for a match
// @route   POST /api/swipes
// @access  Private
exports.submitSwipe = async (req, res) => {
  const { activityId, swipedId, decision } = req.body;
  const swiperId = req.user._id;

  try {
    // --- Validation Steps ---
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    if (activity.status !== 'completed') {
      return res.status(400).json({ message: 'Swiping is only allowed for completed activities' });
    }
    // Ensure both users were in the activity
    if (!activity.members.includes(swiperId) || !activity.members.includes(swipedId)) {
      return res.status(403).json({ message: 'Both users must be members of the activity' });
    }

    // --- Logic ---
    // 1. Record the user's swipe
    const swipe = await Swipe.create({
      activityId,
      swiperId,
      swipedId,
      decision,
    });

    // 2. If it was a 'yes', check if the other person also swiped 'yes'
    if (decision === 'yes') {
      const reverseSwipe = await Swipe.findOne({
        activityId: activityId,
        swiperId: swipedId,   // The other person
        swipedId: swiperId,   // Swiping on you
        decision: 'yes',
      });

      // 3. If the reverse swipe exists, IT'S A MATCH!
      if (reverseSwipe) {
        // Create a private chat room for the two matched users
        const newChatRoom = await ChatRoom.create({
          participants: [swiperId, swipedId],
        });
        return res.json({ match: true, chatRoomId: newChatRoom._id });
      }
    }

    // If no match, just confirm the swipe was recorded
    res.json({ match: false });

  } catch (error) {
    // Handle cases where a swipe already exists (due to unique index)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already swiped on this user for this activity' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
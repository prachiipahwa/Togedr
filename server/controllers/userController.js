// server/controllers/userController.js
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    // Also fetch activities the user has joined or created
    const activities = await Activity.find({ members: req.user.id }).sort({ time: -1 });
    
    res.json({ user, activities });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio ?? user.bio;
      user.interests = req.body.interests || user.interests;
      user.profilePictureUrl = req.body.profilePictureUrl || user.profilePictureUrl;

      const updatedUser = await user.save();

      // Respond with the full, updated user object AND the token
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        interests: updatedUser.interests,
        profilePictureUrl: updatedUser.profilePictureUrl,
        token: req.token, // <-- THIS IS THE CRUCIAL PART
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a user's public profile by ID
// @route   GET /api/users/:id
// @access  Public
exports.getPublicUserProfile = async (req, res) => {
  try {
    // Find user but exclude sensitive info like email and password
    const user = await User.findById(req.params.id).select('-email -password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const activities = await Activity.find({ members: req.params.id }).sort({ time: -1 });
    
    res.json({ user, activities });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
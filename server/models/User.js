const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true, // Ensures no two users can have the same email
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  profilePictureUrl: {
    type: String,
    default: 'https://i.imgur.com/6VBx3io.png', // A default profile picture
  },
  bio: {
    type: String,
    default: '',
  },
  interests: {
    type: [String], // An array of strings
  },

  // --- NEW FIELD FOR SWIPE TRACKING ---
  completedMoments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
  }],
  // ------------------------------------

}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const SwipeSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  },
  swiperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  swipedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  decision: {
    type: String,
    enum: ['yes', 'no'],
    required: true,
  },
}, {
  timestamps: true
});

// Ensures a user can only swipe once on another user per activity
SwipeSchema.index({ activityId: 1, swiperId: 1, swipedId: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', SwipeSchema);
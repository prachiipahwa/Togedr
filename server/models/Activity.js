const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  tag: {
    type: String,
    required: [true, 'Please provide a tag'],
  },
  time: {
    type: Date,
    required: [true, 'Please provide a time for the activity'],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  imageUrl: {
    type: String,
  },
  // --- THIS IS THE MISSING FIELD ---
  chatRoomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom'
  },
  locationName: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  }
}, {
  timestamps: true
});

ActivitySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Activity', ActivitySchema);
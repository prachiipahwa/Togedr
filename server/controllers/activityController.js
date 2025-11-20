const Activity = require('../models/Activity');

const ChatRoom = require('../models/ChatRoom');



// @desc    Create a new activity

// @route   POST /api/activities

// @access  Private

exports.createActivity = async (req, res) => {

  try {

    const { title, description, tag, time, location, locationName, imageUrl } = req.body;

   

    const newChatRoom = await ChatRoom.create({

      participants: [req.user._id],

    });



    const activity = await Activity.create({

      title, description, tag, time, location, locationName, imageUrl,

      creator: req.user._id,

      members: [req.user._id],

      chatRoomID: newChatRoom._id,

    });



    newChatRoom.activityId = activity._id;

    await newChatRoom.save();



    res.status(201).json(activity);

  } catch (error) {

    res.status(500).json({ message: 'Server Error', error: error.message });

  }

};



// @desc    Get all upcoming activities near a location

// @route   GET /api/activities

// @access  Public

exports.getActivities = async (req, res) => {

  try {

    const { lng, lat } = req.query;

    if (!lng || !lat) {

      return res.status(400).json({ message: 'Please provide longitude and latitude' });

    }

    const activities = await Activity.find({

      status: 'upcoming',

      location: {

        $near: {

          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },

          $maxDistance: 10000

        }

      }

    }).populate('creator', 'name profilePictureUrl');

    res.json(activities);

  } catch (error) {

    res.status(500).json({ message: 'Server Error', error: error.message });

  }

};



// @desc    Get ALL activities, regardless of location

// @route   GET /api/activities/all

// @access  Public

exports.getAllActivities = async (req, res) => {

  try {

    const activities = await Activity.find({})

      .sort({ createdAt: -1 })

      .populate('creator', 'name profilePictureUrl')

      .populate('members', 'name');

    res.json(activities);

  } catch (error) {

    res.status(500).json({ message: 'Server Error', error: error.message });

  }

};



// @desc    Get a single activity by its ID

// @route   GET /api/activities/:id

// @access  Public

exports.getActivityById = async (req, res) => {

  try {

    const activity = await Activity.findById(req.params.id).populate('creator', 'name profilePictureUrl').populate('members', 'name profilePictureUrl');

    if (!activity) {

      return res.status(404).json({ message: 'Activity not found' });

    }

    res.json(activity);

  } catch (error) {

    res.status(500).json({ message: 'Server Error', error: error.message });

  }

};



// @desc    Join an activity

// @route   POST /api/activities/:id/join

// @access  Private

exports.joinActivity = async (req, res) => {

  try {

    const activity = await Activity.findById(req.params.id);

    if (!activity) {

      return res.status(404).json({ message: 'Activity not found' });

    }

    if (activity.members.includes(req.user._id)) {

      return res.status(400).json({ message: 'Already a member' });

    }

    activity.members.push(req.user._id);

    await ChatRoom.findByIdAndUpdate(activity.chatRoomID, {

      $addToSet: { participants: req.user._id }

    });

    await activity.save();

    res.json(activity);

  } catch (error) {

    res.status(500).json({ message: 'Server Error', error: error.message });

  }

};



// @desc    Leave an activity

// @route   POST /api/activities/:id/leave

// @access  Private

exports.leaveActivity = async (req, res) => {

  try {

    const activity = await Activity.findById(req.params.id);

    if (!activity) {

      return res.status(404).json({ message: 'Activity not found' });

    }

    activity.members = activity.members.filter(

      (memberId) => memberId.toString() !== req.user._id.toString()

    );

    await ChatRoom.findByIdAndUpdate(activity.chatRoomID, {

      $pull: { participants: req.user._id }

    });

    await activity.save();

    res.json(activity);

  } catch (error) {

    res.status(500).json({ message: 'Server Error', error: error.message });

  }

};



// @desc    Mark an activity as complete

// @route   PUT /api/activities/:id/complete

// @access  Private (Creator only)

exports.completeActivity = async (req, res) => {

  try {

    const activity = await Activity.findById(req.params.id);

    if (!activity) {

      return res.status(404).json({ message: 'Activity not found' });

    }

    if (activity.creator.toString() !== req.user._id.toString()) {

      return res.status(401).json({ message: 'User not authorized' });

    }

    activity.status = 'completed';

    await activity.save();

    res.json(activity);

  } catch (error) {

    res.status(500).json({ message: 'Server Error' });

  }

};



// @desc    Cancel an activity

// @route   PUT /api/activities/:id/cancel

// @access  Private (Creator only)

exports.cancelActivity = async (req, res) => {

  try {

    const activity = await Activity.findById(req.params.id);

    if (!activity) {

      return res.status(404).json({ message: 'Activity not found' });

    }

    if (activity.creator.toString() !== req.user._id.toString()) {

      return res.status(401).json({ message: 'User not authorized' });

    }

    activity.status = 'cancelled';

    await activity.save();

    res.json(activity);

  } catch (error) {

    res.status(500).json({ message: 'Server Error' });

  }

};



// @desc    Get recommended activities based on user interests

// @route   GET /api/activities/foryou

// @access  Private

exports.getForYouActivities = async (req, res) => {

  try {

    const user = req.user;

    if (!user.interests || user.interests.length === 0) {

      return res.json([]);

    }

    const recommendedActivities = await Activity.find({

      status: 'upcoming',

      tag: { $in: user.interests },

      creator: { $ne: user._id }

    })

    .sort({ createdAt: -1 })

    .populate('creator', 'name profilePictureUrl');

    res.json(recommendedActivities);

  } catch (error) {

    res.status(500).json({ message: 'Server Error', error: error.message });

  }

};



// @desc    Update an activity

// @route   PUT /api/activities/:id

// @access  Private (Creator only)

exports.updateActivity = async (req, res) => {

  try {

    const activity = await Activity.findById(req.params.id);



    if (!activity) {

      return res.status(404).json({ message: 'Activity not found' });

    }



    // Check if the user is the creator

    if (activity.creator.toString() !== req.user.id) {

      return res.status(401).json({ message: 'User not authorized' });

    }



    const { title, description, tag, time, location, locationName, imageUrl } = req.body;

   

    activity.title = title || activity.title;

    activity.description = description || activity.description;

    activity.tag = tag || activity.tag;

    activity.time = time || activity.time;

    activity.location = location || activity.location;

    activity.locationName = locationName || activity.locationName;

    activity.imageUrl = imageUrl || activity.imageUrl;



    const updatedActivity = await activity.save();

    res.json(updatedActivity);

  } catch (error) {

    res.status(500).json({ message: 'Server Error' });

  }

};



// @desc    Delete an activity

// @route   DELETE /api/activities/:id

// @access  Private (Creator only)

exports.deleteActivity = async (req, res) => {

  try {

    const activity = await Activity.findById(req.params.id);



    if (!activity) {

      return res.status(404).json({ message: 'Activity not found' });

    }



    if (activity.creator.toString() !== req.user.id) {

      return res.status(401).json({ message: 'User not authorized' });

    }



    await activity.deleteOne();

    res.json({ message: 'Activity removed' });

  } catch (error) {

    res.status(500).json({ message: 'Server Error' });

  }

};
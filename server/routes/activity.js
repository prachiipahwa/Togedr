const express = require('express');
const router = express.Router();
const { createActivity, getActivities, getActivityById, joinActivity, leaveActivity, completeActivity, cancelActivity, getAllActivities, getForYouActivities, updateActivity, deleteActivity } = require('../controllers/activityController');

// --- MODIFIED: Import both 'protect' and 'authOptional' ---
const { protect, authOptional } = require('../middleware/authMiddleware');

router.route('/')
  .get(getActivities)
  .post(protect, createActivity);

// Route to get all activities
router.route('/all')
  .get(getAllActivities);

router.route('/foryou')
  .get(protect, getForYouActivities);
  
// --- MODIFIED: Use authOptional for the public-facing 'get' route ---
router.route('/:id')
  .get(authOptional, getActivityById) // <-- This route now optionally has req.user
  .put(protect, updateActivity)
  .delete(protect, deleteActivity);


// Route for joining an activity
router.route('/:id/join')
  .post(protect, joinActivity);

// Route for leaving an activity
router.route('/:id/leave')
  .post(protect, leaveActivity);

// Route for completing an activity
router.route('/:id/complete')
  .put(protect, completeActivity);

// Route for cancelling an activity
router.route('/:id/cancel')
  .put(protect, cancelActivity);

module.exports = router;
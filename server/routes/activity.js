const express = require('express');

const router = express.Router();

const { createActivity, getActivities, getActivityById, joinActivity, leaveActivity, completeActivity,cancelActivity, getAllActivities, getForYouActivities, updateActivity, deleteActivity } = require('../controllers/activityController');

const { protect } = require('../middleware/authMiddleware');



// Notice how 'protect' is placed before 'createActivity'.

// This ensures only logged-in users can access this route.

// router.post('/', protect, createActivity);

router.route('/')

  .get(getActivities)

  .post(protect, createActivity);



// Route to get all activities

router.route('/all')

  .get(getAllActivities);



router.route('/foryou')

  .get(protect, getForYouActivities);

 

// Route to get a single activity by its ID

router.route('/:id')

  .get(getActivityById)

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
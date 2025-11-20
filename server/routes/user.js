// server/routes/user.js

const express = require('express');

const router = express.Router();

const { getUserProfile, updateUserProfile, getPublicUserProfile} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');



router.route('/profile')

  .get(protect, getUserProfile)

  .put(protect, updateUserProfile);



router.route('/:id')

  .get(getPublicUserProfile);

 

module.exports = router; 
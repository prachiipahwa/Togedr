const express = require('express');

const router = express.Router();

const { submitSwipe } = require('../controllers/swipeController');

const { protect } = require('../middleware/authMiddleware');



// All swipe actions go through this single endpoint

router.post('/', protect, submitSwipe);



module.exports = router;
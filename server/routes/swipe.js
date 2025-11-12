const express = require('express');
const router = express.Router();
// --- UPDATED: Import the new function ---
const { submitSwipe, markMomentAsComplete } = require('../controllers/swipeController');
const { protect } = require('../middleware/authMiddleware');

// All swipe actions go through this single endpoint
router.post('/', protect, submitSwipe);

// --- NEW ROUTE ---
// Route to mark a "moment" as completed
router.post('/complete', protect, markMomentAsComplete);

module.exports = router;
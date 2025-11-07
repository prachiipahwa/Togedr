// server/routes/tag.js
const express = require('express');
const router = express.Router();
const { getTags, addTag } = require('../controllers/tagController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTags)
  .post(protect, addTag); // Only logged-in users can add tags

module.exports = router;
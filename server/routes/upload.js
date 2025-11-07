// server/routes/upload.js
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/authMiddleware');

// This endpoint generates a signature for a secure upload
router.post('/signature', protect, (req, res) => {
  const timestamp = Math.round((new Date).getTime()/1000);
  
  // The signature is created using the secret key configured in index.js
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
  }, process.env.CLOUDINARY_API_SECRET);
  
  res.json({ timestamp, signature });
});

module.exports = router;
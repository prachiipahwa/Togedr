const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// All routes here will be prefixed with /api/auth
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
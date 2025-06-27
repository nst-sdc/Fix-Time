const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Get user profile - protected route
router.get('/profile', auth, authController.getProfile);

// Update user profile - protected route
router.put('/profile', auth, authController.updateProfile);

module.exports = router;

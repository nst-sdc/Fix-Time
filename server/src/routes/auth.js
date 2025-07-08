const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Role-based login route
router.post('/login-with-role', authController.loginWithRole);

// Get user role by email (for login assistance)
router.get('/user-role/:email', authController.getUserRoles);

// Get user profile - protected route
router.get('/profile', auth, authController.getProfile);

// Update user profile - protected route
router.put('/profile', auth, authController.updateProfile);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/google', authController.googleLogin); // ✅ New route added

router.get('/profile', auth, authController.getProfile);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Google Login route
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split('@')[0];

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        password: null,
        isGoogleUser: true,
      });

      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token: jwtToken, user: { email: user.email, name: user.name } });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(400).json({ error: 'Google authentication failed' });
  }
});

// Get user profile - protected route
router.get('/profile', auth, authController.getProfile);

module.exports = router;

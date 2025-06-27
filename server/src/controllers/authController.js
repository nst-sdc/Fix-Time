const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Register a new user
exports.register = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully. Please log in.',
      success: true
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// Google Sign-In
exports.googleLogin = async (req, res) => {
  console.log('Google login request body:', req.body);
  const { email, name, sub } = req.body;
  try {
    if (!email || !sub || !name) {
      return res.status(400).json({ error: 'Invalid Google data received: missing email, name, or sub.' });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        password: sub, // sub is a unique ID from Google
      });
      await user.save();
    }
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables!');
      return res.status(500).json({ error: 'Server misconfiguration: JWT secret missing.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: 'Server error during Google login' });
  }
};


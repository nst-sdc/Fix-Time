const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Register a new user
exports.register = async (req, res) => {
  const { 
    email, 
    password, 
    fullName, 
    phoneNumber, 
    address, 
    dateOfBirth, 
    gender,
    role,
    businessInfo 
  } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate required fields
    if (!email || !password || !fullName || !phoneNumber || !address || !gender) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate role if provided
    const userRole = role || 'customer';
    if (!['customer', 'provider'].includes(userRole)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Validate business info for providers
    if (userRole === 'provider') {
      if (!businessInfo || !businessInfo.businessName) {
        return res.status(400).json({ error: 'Business name is required for service providers' });
      }
    }

    // Create new user with all profile data
    const userData = {
      email,
      password,
      fullName,
      phoneNumber,
      address,
      gender,
      role: userRole
    };

    // Add dateOfBirth if provided
    if (dateOfBirth) {
      userData.dateOfBirth = new Date(dateOfBirth);
    }

    // Add business info for providers
    if (userRole === 'provider' && businessInfo) {
      userData.businessInfo = {
        businessName: businessInfo.businessName,
        businessDescription: businessInfo.businessDescription || '',
        businessCategory: businessInfo.businessCategory || '',
        businessHours: businessInfo.businessHours || ''
      };
    }

    const user = new User(userData);
    await user.save();

    // Don't generate JWT for registration
    // Just return success message
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

    const userData = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Include business info for providers
    if (user.role === 'provider' && user.businessInfo) {
      userData.businessInfo = user.businessInfo;
    }

    res.json({ 
      message: 'Login successful', 
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    console.log('Getting profile for user ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    console.log('User found:', user.email);
    
    const userData = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Include business info for providers
    if (user.role === 'provider' && user.businessInfo) {
      userData.businessInfo = user.businessInfo;
    }

    res.json({
      success: true,
      user: userData
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ success: false, error: 'Server error fetching profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { 
      fullName, 
      email,
      phoneNumber, 
      address, 
      dateOfBirth, 
      gender,
      businessInfo
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Check if email is being changed and if it's already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          error: 'Email is already taken by another user' 
        });
      }
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (gender) user.gender = gender;

    // Update business info for providers
    if (user.role === 'provider' && businessInfo) {
      user.businessInfo = {
        ...user.businessInfo,
        businessName: businessInfo.businessName || user.businessInfo.businessName,
        businessDescription: businessInfo.businessDescription || user.businessInfo.businessDescription,
        businessCategory: businessInfo.businessCategory || user.businessInfo.businessCategory,
        businessHours: businessInfo.businessHours || user.businessInfo.businessHours
      };
    }

    await user.save();

    const userData = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Include business info for providers
    if (user.role === 'provider' && user.businessInfo) {
      userData.businessInfo = user.businessInfo;
    }

    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error updating profile' 
    });
  }
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Register a new user
exports.register = async (req, res, next) => {
    const {
        email,
        password,
        fullName,
        phoneNumber,
        address,
        dateOfBirth,
        gender
    } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            return next(error);
        }

        // Validate required fields
        if (!email || !password || !fullName || !phoneNumber || !address || !gender) {
            const error = new Error('All required fields must be provided');
            error.statusCode = 400;
            return next(error);
        }

        // Create new user with all profile data
        const userData = {
            email,
            password,
            fullName,
            phoneNumber,
            address,
            gender
        };

        // Add dateOfBirth if provided
        if (dateOfBirth) {
            userData.dateOfBirth = new Date(dateOfBirth);
        }

        const user = new User(userData);
        await user.save();

        res.status(201).json({
            message: 'User registered successfully. Please log in.',
            success: true
        });
    } catch (err) {
        next(err);
    }
};

// Login user
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get user profile
exports.getProfile = async (req, res, next) => {
    try {
        console.log('Getting profile for user ID:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        console.log('User found:', user.email);
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.fullName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        next(err);
    }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
    try {
        const {
            fullName,
            email,
            phoneNumber,
            address,
            dateOfBirth,
            gender
        } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        // Check if email is being changed and if it's already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                const error = new Error('Email is already taken by another user');
                error.statusCode = 400;
                return next(error);
            }
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (address) user.address = address;
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
        if (gender) user.gender = gender;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        next(err);
    }
};

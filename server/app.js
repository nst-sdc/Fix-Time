const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const authRoutes = require('./src/routes/auth');
const appointmentRoutes = require('./src/routes/appointments');
const serviceRoutes = require('./src/routes/services');
const reviewRoutes = require('./src/routes/reviews');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);

// Global error handler
app.use(errorHandler);

// Start server and connect to MongoDB
const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MongoDB URI not found in environment variables.');
        }

        await mongoose.connect(process.env.MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });

        console.log('✅ MongoDB connected successfully');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        process.exit(1); // Exit the process if DB connection fails
    }
};

startServer();

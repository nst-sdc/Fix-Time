// server/src/middleware/errorHandler.js

// Central error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log full stack trace for debugging
    console.error('Error Stack:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        // Show stack trace only in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;

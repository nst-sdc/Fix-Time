const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// All routes are protected by auth middleware
router.use(auth);

// Get all notifications for logged-in user
router.get('/', notificationController.getNotifications);

// Mark a notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.post('/mark-all-read', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router; 
const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Provider = require('../models/Provider');

/**
 * Get all notifications for the logged-in user
 * @route GET /api/notifications
 * @access Private
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { recipientId: userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('appointmentId', 'customerName serviceId date time status')
      .populate('serviceId', 'name category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipientId: userId, 
      isRead: false 
    });

    res.status(200).json({
      success: true,
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

/**
 * Mark a notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientId: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 * @route POST /api/notifications/mark-all-read
 * @access Private
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: error.message
    });
  }
};

/**
 * Delete a notification
 * @route DELETE /api/notifications/:id
 * @access Private
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipientId: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

/**
 * Create a notification (internal use)
 * @param {Object} notificationData - Notification data
 */
exports.createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create booking request notification for provider
 * @param {Object} appointmentData - Appointment data
 */
exports.createBookingRequestNotification = async (appointmentData) => {
  try {
    const { appointmentId, serviceId, customerName, date, time } = appointmentData;
    
    // Get service details
    const service = await Service.findById(serviceId).populate('providerId');
    if (!service || !service.providerId) {
      throw new Error('Service or provider not found');
    }

    const notificationData = {
      recipientId: service.providerId.userId,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `${customerName} has requested a booking for ${service.name} on ${new Date(date).toLocaleDateString()} at ${time}`,
      appointmentId,
      serviceId,
      priority: 'high',
      actionRequired: true,
      metadata: {
        customerName,
        serviceName: service.name,
        date,
        time
      }
    };

    return await this.createNotification(notificationData);
  } catch (error) {
    console.error('Error creating booking request notification:', error);
    throw error;
  }
};

/**
 * Create booking status update notification for customer
 * @param {Object} appointmentData - Appointment data
 * @param {String} status - New status
 */
exports.createBookingStatusNotification = async (appointmentData, status) => {
  try {
    const { appointmentId, serviceId, userId, customerName } = appointmentData;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    let title, message, type;
    
    switch (status) {
      case 'confirmed':
        title = 'Booking Confirmed!';
        message = `Your booking for ${service.name} has been confirmed by the service provider.`;
        type = 'booking_confirmed';
        break;
      case 'rejected':
        title = 'Booking Request Declined';
        message = `Your booking request for ${service.name} has been declined by the service provider.`;
        type = 'booking_rejected';
        break;
      case 'cancelled':
        title = 'Booking Cancelled';
        message = `Your booking for ${service.name} has been cancelled.`;
        type = 'booking_cancelled';
        break;
      case 'completed':
        title = 'Service Completed';
        message = `Your ${service.name} service has been marked as completed. Please leave a review!`;
        type = 'booking_completed';
        break;
      default:
        return null;
    }

    const notificationData = {
      recipientId: userId,
      type,
      title,
      message,
      appointmentId,
      serviceId,
      priority: status === 'confirmed' ? 'high' : 'medium',
      actionRequired: status === 'completed',
      metadata: {
        serviceName: service.name,
        status
      }
    };

    return await this.createNotification(notificationData);
  } catch (error) {
    console.error('Error creating booking status notification:', error);
    throw error;
  }
}; 
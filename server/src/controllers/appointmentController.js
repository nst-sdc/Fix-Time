const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const mongoose = require('mongoose');
const notificationController = require('./notificationController');

/**
 * Create a new appointment
 * @route POST /api/appointments
 * @access Private - For logged-in users only
 */
exports.createAppointment = async (req, res) => {
  try {
    const {
      serviceId,
      date,
      time,
      notes,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress
    } = req.body;

    console.log("Creating appointment with data:", {
      serviceId,
      date,
      time,
      notes: notes ? 'provided' : 'not provided',
      customerName,
      customerEmail,
      customerPhone: customerPhone ? 'provided' : 'not provided',
      customerAddress: customerAddress ? 'provided' : 'not provided'
    });

    // Get userId from auth middleware
    const userId = req.user.id;
    console.log("User ID from auth:", userId);

    // Validate required fields
    const missingFields = [];
    if (!serviceId) missingFields.push('serviceId');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!customerName) missingFields.push('customerName');
    if (!customerEmail) missingFields.push('customerEmail');
    if (!customerPhone) missingFields.push('customerPhone');
    if (!customerAddress) missingFields.push('customerAddress');

    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Check if service exists and get provider info
    console.log("Looking up service with ID:", serviceId);
    try {
      const service = await Service.findById(serviceId).populate('providerId');
      if (!service) {
        console.log("Service not found with ID:", serviceId);
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }
      
      if (!service.providerId) {
        console.log("Service has no provider assigned");
        return res.status(400).json({
          success: false,
          message: 'Service is not available for booking'
        });
      }
      
      console.log("Found service:", service.name, "Provider:", service.providerId._id);
    } catch (serviceErr) {
      console.error("Error finding service:", serviceErr);
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      userId,
      serviceId,
      providerId: service.providerId._id,
      date,
      time,
      notes: notes || '',
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      status: 'pending',
      hasReviewed: false
    });

    await appointment.save();
    console.log("Appointment saved with ID:", appointment._id);

    // Create notification for provider
    try {
      await notificationController.createBookingRequestNotification({
        appointmentId: appointment._id,
        serviceId,
        customerName,
        date,
        time
      });
      console.log("Provider notification created successfully");
    } catch (notificationErr) {
      console.error("Error creating provider notification:", notificationErr);
      // Don't fail the appointment creation if notification fails
    }

    // Populate service details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('serviceId', 'name category provider location')
      .populate('providerId', 'businessName contactPhone contactEmail');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully and provider notified',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    // Check for mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    // Check for MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('Database error details:', error.code, error.message);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

/**
 * Get all appointments for the logged-in user
 * @route GET /api/appointments
 * @access Private - For logged-in users
 */
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get appointments with service details
    const appointments = await Appointment.find({ userId })
      .populate('serviceId', 'name category provider location')
      .populate('providerId', 'businessName contactPhone contactEmail')
      .sort({ date: 1 }); // Sort by date ascending

    // Format appointments for frontend display
    const formattedAppointments = appointments.map(appointment => {
      const service = appointment.serviceId;
      const provider = appointment.providerId;
      return {
        _id: appointment._id,
        serviceName: service ? service.name : 'Unknown Service',
        serviceCategory: service ? service.category : 'Other',
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        provider: provider ? provider.businessName : (service ? service.provider : 'Unknown Provider'),
        providerContact: provider ? provider.contactPhone : '',
        providerEmail: provider ? provider.contactEmail : '',
        location: service ? service.location : 'Unknown Location',
        notes: appointment.notes,
        hasReviewed: appointment.hasReviewed,
        customerName: appointment.customerName,
        customerEmail: appointment.customerEmail,
        customerPhone: appointment.customerPhone,
        customerAddress: appointment.customerAddress
      };
    });

    res.status(200).json({
      success: true,
      appointments: formattedAppointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get all appointments for a provider
 * @route GET /api/appointments/provider
 * @access Private - For providers only
 */
exports.getProviderAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    // Find provider by userId
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // Build query
    const query = { providerId: provider._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get appointments with pagination
    const appointments = await Appointment.find(query)
      .populate('serviceId', 'name category price duration')
      .populate('userId', 'name email')
      .sort({ bookingRequestedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Appointment.countDocuments(query);
    const pendingCount = await Appointment.countDocuments({ 
      providerId: provider._id, 
      status: 'pending' 
    });

    // Format appointments for provider view
    const formattedAppointments = appointments.map(appointment => {
      const service = appointment.serviceId;
      const customer = appointment.userId;
      return {
        _id: appointment._id,
        serviceName: service ? service.name : 'Unknown Service',
        serviceCategory: service ? service.category : 'Other',
        servicePrice: service ? service.price : 0,
        serviceDuration: service ? service.duration : 0,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        customerName: appointment.customerName,
        customerEmail: appointment.customerEmail,
        customerPhone: appointment.customerPhone,
        customerAddress: appointment.customerAddress,
        notes: appointment.notes,
        providerNotes: appointment.providerNotes,
        bookingRequestedAt: appointment.bookingRequestedAt,
        hasReviewed: appointment.hasReviewed
      };
    });

    res.status(200).json({
      success: true,
      appointments: formattedAppointments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAppointments: total,
        pendingCount
      }
    });
  } catch (error) {
    console.error('Error fetching provider appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update appointment status (for providers)
 * @route PATCH /api/appointments/:id/provider-status
 * @access Private - For providers only
 */
exports.updateProviderAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, providerNotes } = req.body;
    const userId = req.user.id;

    if (!status || !['pending', 'confirmed', 'rejected', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status'
      });
    }

    // Find provider
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // Find appointment and check provider ownership
    const appointment = await Appointment.findOne({ _id: id, providerId: provider._id })
      .populate('serviceId', 'name')
      .populate('userId', 'name email');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you are not authorized'
      });
    }

    // Update appointment
    appointment.status = status;
    if (providerNotes) {
      appointment.providerNotes = providerNotes;
    }
    await appointment.save();

    // Create notification for customer
    try {
      await notificationController.createBookingStatusNotification({
        appointmentId: appointment._id,
        serviceId: appointment.serviceId._id,
        userId: appointment.userId._id,
        customerName: appointment.customerName
      }, status);
      console.log("Customer notification created successfully");
    } catch (notificationErr) {
      console.error("Error creating customer notification:", notificationErr);
      // Don't fail the status update if notification fails
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating provider appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get customer details for an appointment (for providers)
 * @route GET /api/appointments/:id/customer-details
 * @access Private - For providers only
 */
exports.getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find provider
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // Find appointment and check provider ownership
    const appointment = await Appointment.findOne({ _id: id, providerId: provider._id })
      .populate('serviceId', 'name category price duration')
      .populate('userId', 'name email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you are not authorized'
      });
    }

    const customerDetails = {
      appointmentId: appointment._id,
      serviceName: appointment.serviceId ? appointment.serviceId.name : 'Unknown Service',
      serviceCategory: appointment.serviceId ? appointment.serviceId.category : 'Other',
      servicePrice: appointment.serviceId ? appointment.serviceId.price : 0,
      serviceDuration: appointment.serviceId ? appointment.serviceId.duration : 0,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      customerName: appointment.customerName,
      customerEmail: appointment.customerEmail,
      customerPhone: appointment.customerPhone,
      customerAddress: appointment.customerAddress,
      notes: appointment.notes,
      providerNotes: appointment.providerNotes,
      bookingRequestedAt: appointment.bookingRequestedAt
    };

    res.status(200).json({
      success: true,
      customerDetails
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update appointment status (for customers)
 * @route PATCH /api/appointments/:id/status
 * @access Private - For logged-in users
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !['pending', 'confirmed', 'rejected', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status'
      });
    }

    // Find appointment and check ownership
    const appointment = await Appointment.findOne({ _id: id, userId })
      .populate('serviceId', 'name')
      .populate('providerId', 'userId');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you are not authorized'
      });
    }

    // Update status
    appointment.status = status;
    await appointment.save();

    // Create notification for provider if appointment is cancelled
    if (status === 'cancelled' && appointment.providerId) {
      try {
        await notificationController.createBookingStatusNotification({
          appointmentId: appointment._id,
          serviceId: appointment.serviceId._id,
          userId: appointment.providerId.userId,
          customerName: appointment.customerName
        }, status);
      } catch (notificationErr) {
        console.error("Error creating provider notification:", notificationErr);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete an appointment
 * @route DELETE /api/appointments/:id
 * @access Private - For logged-in users
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find appointment and check ownership
    const appointment = await Appointment.findOne({ _id: id, userId });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you are not authorized'
      });
    }

    // Delete appointment
    await Appointment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Reschedule an appointment
 * @route PUT /api/appointments/:id/reschedule
 * @access Private - For logged-in users
 */
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both date and time'
      });
    }

    // Find appointment and check ownership
    const appointment = await Appointment.findOne({ _id: id, userId });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you are not authorized'
      });
    }

    // Update appointment
    appointment.date = date;
    appointment.time = time;
    await appointment.save();

    // Populate service details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('serviceId', 'name category provider location')
      .populate('providerId', 'businessName contactPhone contactEmail');

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 
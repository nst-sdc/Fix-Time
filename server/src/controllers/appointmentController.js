const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const mongoose = require('mongoose');

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
      customerPhone
    } = req.body;

    console.log("Creating appointment with data:", {
      serviceId,
      date,
      time,
      notes: notes ? 'provided' : 'not provided',
      customerName,
      customerEmail,
      customerPhone: customerPhone ? 'provided' : 'not provided'
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

    // Check if service exists
    console.log("Looking up service with ID:", serviceId);
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        console.log("Service not found with ID:", serviceId);
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }
      console.log("Found service:", service.name);
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
      date,
      time,
      notes: notes || '',
      customerName,
      customerEmail,
      customerPhone,
      status: 'scheduled',
      hasReviewed: false
    });

    await appointment.save();
    console.log("Appointment saved with ID:", appointment._id);

    // Populate service details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('serviceId', 'name category provider location');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
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
      .sort({ date: 1 }); // Sort by date ascending

    // Format appointments for frontend display
    const formattedAppointments = appointments.map(appointment => {
      const service = appointment.serviceId;
      return {
        _id: appointment._id,
        serviceName: service ? service.name : 'Unknown Service',
        serviceCategory: service ? service.category : 'Other',
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        provider: service ? service.provider : 'Unknown Provider',
        location: service ? service.location : 'Unknown Location',
        notes: appointment.notes,
        hasReviewed: appointment.hasReviewed,
        customerName: appointment.customerName,
        customerEmail: appointment.customerEmail,
        customerPhone: appointment.customerPhone
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
 * Update appointment status
 * @route PATCH /api/appointments/:id/status
 * @access Private - For logged-in users
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !['scheduled', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status'
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

    // Update status
    appointment.status = status;
    await appointment.save();

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
      .populate('serviceId', 'name category provider location');

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
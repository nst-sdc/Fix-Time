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
    let service;
    try {
      service = await Service.findById(serviceId);
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

    // Validate that service is available
    if (!service.available) {
      return res.status(400).json({
        success: false,
        message: 'This service is currently unavailable'
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

    if (!populatedAppointment) {
      console.error("Failed to populate appointment after creation");
      return res.status(500).json({
        success: false,
        message: 'Appointment created but failed to retrieve details'
      });
    }

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
    console.log('getUserAppointments called');
    const userId = req.user.id;
    console.log('User ID:', userId);

    // Get appointments with service details
    const appointments = await Appointment.find({ userId })
      .populate('serviceId', 'name category provider location')
      .sort({ date: 1 }); // Sort by date ascending

    console.log('Found appointments:', appointments.length);
    console.log('Raw appointments:', appointments);

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

    console.log('Formatted appointments:', formattedAppointments);

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
    console.log('Reschedule request received:', {
      appointmentId: req.params.id,
      body: req.body,
      userId: req.user.id
    });

    const { id } = req.params;
    const { date, time } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!date || !time) {
      console.log('Missing required fields:', { date, time });
      return res.status(400).json({
        success: false,
        message: 'Date and time are required for rescheduling'
      });
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.log('Invalid date format:', date);
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Check if new date is in the future
    const now = new Date();
    if (dateObj <= now) {
      console.log('Attempted to reschedule to past date:', date);
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule to a past date'
      });
    }

    // Find appointment and check ownership
    console.log('Looking for appointment:', { id, userId });
    const appointment = await Appointment.findOne({ _id: id, userId });
    if (!appointment) {
      console.log('Appointment not found or unauthorized:', { id, userId });
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you are not authorized'
      });
    }

    console.log('Found appointment:', {
      id: appointment._id,
      status: appointment.status,
      currentDate: appointment.date,
      currentTime: appointment.time
    });

    // Check if appointment can be rescheduled (only scheduled or confirmed appointments)
    if (!['scheduled', 'confirmed'].includes(appointment.status)) {
      console.log('Appointment cannot be rescheduled due to status:', appointment.status);
      return res.status(400).json({
        success: false,
        message: 'Only scheduled or confirmed appointments can be rescheduled'
      });
    }

    // Update appointment date and time
    appointment.date = date;
    appointment.time = time;
    appointment.status = 'scheduled'; // Reset to scheduled status
    
    console.log('Updating appointment with new data:', {
      newDate: date,
      newTime: time,
      newStatus: 'scheduled'
    });

    await appointment.save();
    console.log('Appointment updated successfully');

    // Populate service details for response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('serviceId', 'name category provider location');

    console.log('Sending success response');
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
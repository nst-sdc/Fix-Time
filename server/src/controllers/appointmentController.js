const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments/book
 * @access  Private
 */
exports.bookAppointment = async (req, res) => {
  try {
    const { serviceId, date, time, notes, customerName, customerEmail, customerPhone } = req.body;
    const userId = req.user.userId; // from auth middleware

    // Basic validation
    if (!serviceId || !date || !time || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields for the appointment.',
      });
    }

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Create and save the new appointment
    const newAppointment = new Appointment({
      userId,
      serviceId,
      date: new Date(date), // Ensure date is a valid Date object
      time,
      notes,
      customerName,
      customerEmail,
      customerPhone,
      status: 'scheduled',
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: newAppointment,
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while booking appointment.',
    });
  }
}; 
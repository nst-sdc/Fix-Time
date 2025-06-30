const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

// @route   POST api/appointments/book
// @desc    Book a new appointment
// @access  Private
router.post('/book', auth, appointmentController.bookAppointment);

module.exports = router; 
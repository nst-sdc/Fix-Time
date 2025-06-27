const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1000
  },
  // We'll use the timestamps option for the created/updated timestamps
}, { timestamps: true });

// Compound index to ensure a user can only submit one review per appointment
reviewSchema.index({ userId: 1, appointmentId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 
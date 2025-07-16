const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled', 'no-show', 'scheduled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  providerNotes: {
    type: String,
    default: ''
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  bookingRequestedAt: {
    type: Date,
    default: Date.now
  },
  hasReviewed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for better query performance
appointmentSchema.index({ providerId: 1, status: 1 });
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ bookingRequestedAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema); 
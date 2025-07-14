const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  category: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  duration: { 
    type: Number, 
    required: true, 
    min: 5, 
    comment: 'Duration in minutes' 
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  provider: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  contact: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  timeSlots: {
    type: [String],
    default: []
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  isActive: {
    type: Boolean,
    default: true,
    comment: 'Service availability for booking'
  },
  avgRating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

// Indexes for better query performance
serviceSchema.index({ providerId: 1, isActive: 1 });
serviceSchema.index({ category: 1, available: 1 });
serviceSchema.index({ name: 1 });

module.exports = mongoose.model('Service', serviceSchema); 
const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessDescription: {
    type: String,
    required: false,
    trim: true
  },
  businessCategory: {
    type: String,
    required: true,
    trim: true
  },
  businessHours: {
    type: String,
    required: false,
    default: '9:00 AM - 6:00 PM'
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  location: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  specializations: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    required: false,
    min: 0,
    comment: 'Years of experience'
  }
}, { timestamps: true });

// Index for better query performance
providerSchema.index({ businessCategory: 1, isVerified: 1 });
providerSchema.index({ location: 1 });

module.exports = mongoose.model('Provider', providerSchema); 
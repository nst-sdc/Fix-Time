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

module.exports = mongoose.model('Service', serviceSchema); 
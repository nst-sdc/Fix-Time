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
  },

  // ✅ New fields for dynamic listing
  brand: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  timeSlots: {
    type: [String],
    default: []
  },
  contact: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

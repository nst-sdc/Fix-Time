const Service = require('../models/Service');

/**
 * Get all services or filtered by category
 * @route GET /api/services
 * @access Public
 */
exports.getServices = async (req, res) => {
  try {
    console.log('Fetching services with query:', req.query);
    const { category, name } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
      console.log(`Filtering by category: ${category}`);
    }
    
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search
      console.log(`Searching for name containing: ${name}`);
    }
    
    const services = await Service.find(query).sort('name');
    
    console.log(`Found ${services.length} services`);
    
    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    // Check if it's a MongoDB error
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('Database error details:', error.code, error.message);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

/**
 * Get a single service by ID
 * @route GET /api/services/:id
 * @access Public
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports; 
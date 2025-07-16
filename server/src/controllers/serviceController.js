const Service = require('../models/Service');

/**
 * Get all services or filtered by category
 * @route GET /api/services
 * @access Public
 */
exports.getServices = async (req, res) => {
  try {
    console.log('Fetching services with query:', req.query);
    const { category, name, providerOnly } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
      console.log(`Filtering by category: ${category}`);
    }
    
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search
      console.log(`Searching for name containing: ${name}`);
    }

    // Provider-only filter
    if (providerOnly === 'true' && req.user && req.user.role === 'provider') {
      // Find the provider's _id
      const Provider = require('../models/Provider');
      const provider = await Provider.findOne({ userId: req.user.id });
      if (provider) {
        query.providerId = provider._id;
      } else {
        // No provider profile found, return empty
        return res.status(200).json({ success: true, count: 0, services: [] });
      }
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

/**
 * Create sample services (for development only)
 * @route POST /api/services/sample
 * @access Public
 */
exports.createSampleServices = async (req, res) => {
  try {
    // Check if services already exist
    const count = await Service.countDocuments();
    
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Sample services already exist'
      });
    }
    
    // Sample services for each category
    const sampleServices = [
      // Beauty services
      {
        name: 'Haircut & Styling',
        category: 'Beauty & Personal Care',
        description: 'Professional haircut and styling by expert stylists',
        price: 45,
        duration: 60,
        provider: 'Style Studio',
        location: '123 Fashion Ave'
      },
      {
        name: 'Beard Grooming',
        category: 'Beauty & Personal Care',
        description: 'Complete beard trim, shape and maintenance',
        price: 30,
        duration: 30,
        provider: 'Men\'s Grooming Center',
        location: '456 Style Blvd'
      },
      {
        name: 'Hair Coloring / Smoothening',
        category: 'Beauty & Personal Care',
        description: 'Professional hair coloring or smoothening treatment',
        price: 80,
        duration: 120,
        provider: 'Color Masters',
        location: '789 Beauty Way'
      },
      {
        name: 'Spa & Massage',
        category: 'Beauty & Personal Care',
        description: 'Relaxing full body massage and spa treatment',
        price: 90,
        duration: 90,
        provider: 'Relaxation Spa',
        location: '567 Calm Ave'
      },
      
      // Healthcare services
      {
        name: 'Dental Checkup',
        category: 'Healthcare',
        description: 'Complete dental examination and cleaning',
        price: 120,
        duration: 60,
        provider: 'Smile Dentistry',
        location: '789 Health St'
      },
      
      // Home Repair services
      {
        name: 'Plumbing Repair',
        category: 'Home Repair',
        description: 'Professional plumbing repair and maintenance',
        price: 85,
        duration: 60,
        provider: 'Fast Fix Plumbing',
        location: 'Your Home'
      },
      
      // Automobile services
      {
        name: 'Car Oil Change',
        category: 'Automobile',
        description: 'Quick oil change service for all vehicle types',
        price: 50,
        duration: 30,
        provider: 'Quick Auto Service',
        location: '321 Motor Dr'
      }
    ];
    
    await Service.insertMany(sampleServices);
    
    res.status(201).json({
      success: true,
      message: 'Sample services created successfully',
      count: sampleServices.length
    });
  } catch (error) {
    console.error('Error creating sample services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 

/**
 * Add a new service
 * @route POST /services
 * @access Public
 */
exports.addService = async (req, res) => {
  try {
    // Only allow providers to add services
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const Provider = require('../models/Provider');
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(403).json({ success: false, message: 'Only providers can add services.' });
    }
    // Validate required fields
    const requiredFields = ['name', 'category', 'description', 'price', 'duration'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `${field} is required` 
        });
      }
    }
    // Validate numeric fields
    if (isNaN(req.body.price) || req.body.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }
    if (isNaN(req.body.duration) || req.body.duration < 5) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be at least 5 minutes'
      });
    }
    // Create and save the new service, always set providerId
    const newService = new Service({
      ...req.body,
      providerId: provider._id
    });
    await newService.save();
    res.status(201).json({ 
      success: true, 
      message: "Service added successfully", 
      data: newService 
    });
  } catch (err) {
    console.error('Error adding service:', err);
    // Handle validation errors from Mongoose
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};

/**
 * Update a service (provider only)
 * @route PATCH /services/:id
 * @access Private
 */
exports.updateService = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const Provider = require('../models/Provider');
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(403).json({ success: false, message: 'Only providers can update services.' });
    }
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    if (service.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not own this service.' });
    }
    // Only allow certain fields to be updated
    const updatableFields = ['name', 'category', 'description', 'price', 'duration', 'isActive', 'location', 'buffer', 'timeSlots'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });
    await service.save();
    res.status(200).json({ success: true, message: 'Service updated successfully', data: service });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * Delete a service (provider only)
 * @route DELETE /services/:id
 * @access Private
 */
exports.deleteService = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const Provider = require('../models/Provider');
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(403).json({ success: false, message: 'Only providers can delete services.' });
    }
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    if (service.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not own this service.' });
    }
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * Get services by category
 * @route GET /services/category/:category
 * @access Public
 */
exports.getServicesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category parameter is required'
      });
    }
    
    const services = await Service.find({ category });
    
    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (err) {
    console.error('Error fetching services by category:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};
 
// New: Get services for the logged-in provider only
exports.getProviderServices = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    // Only allow providers
    const Provider = require('../models/Provider');
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(200).json({ success: true, count: 0, services: [] });
    }
    const services = await Service.find({ providerId: provider._id }).sort('name');
    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider services',
      error: error.message
    });
  }
}; 
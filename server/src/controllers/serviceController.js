const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

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
        category: 'Beauty',
        description: 'Professional haircut and styling by expert stylists',
        price: 45,
        duration: 60,
        provider: 'Style Studio',
        location: '123 Fashion Ave'
      },
      {
        name: 'Beard Grooming',
        category: 'Beauty',
        description: 'Complete beard trim, shape and maintenance',
        price: 30,
        duration: 30,
        provider: 'Men\'s Grooming Center',
        location: '456 Style Blvd'
      },
      {
        name: 'Hair Coloring / Smoothening',
        category: 'Beauty',
        description: 'Professional hair coloring or smoothening treatment',
        price: 80,
        duration: 120,
        provider: 'Color Masters',
        location: '789 Beauty Way'
      },
      {
        name: 'Spa & Massage',
        category: 'Beauty',
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

// Added for AddServiceForm
// POST /services - Add a new service
exports.addService = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
    }
    const newService = new Service({ ...req.body, userId });
    await newService.save();
    res.status(201).json({ success: true, message: "Service added", data: newService });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /services/category/:category - Fetch services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const services = await Service.find({ category });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all services owned by the logged-in user, with appointment info
 * @route GET /api/services/my
 * @access Private
 */
exports.getMyServices = async (req, res) => {
  try {
    const userId = req.user.id;
    // 1. Find all services owned by this user
    const ownedServices = await Service.find({ userId });
    // 2. Find all appointments booked by this user
    const myAppointments = await Appointment.find({ userId })
      .populate('serviceId')
      .sort({ date: 1, time: 1 });
    // 3. Build a map of serviceId to user's bookings
    const bookedServiceMap = {};
    myAppointments.forEach(appt => {
      if (appt.serviceId && appt.serviceId._id) {
        const sid = appt.serviceId._id.toString();
        if (!bookedServiceMap[sid]) bookedServiceMap[sid] = [];
        bookedServiceMap[sid].push(appt);
      }
    });
    // 4. Collect all unique services: owned + booked
    const allServiceIds = new Set([
      ...ownedServices.map(s => s._id.toString()),
      ...Object.keys(bookedServiceMap)
    ]);
    // 5. For each unique service, build the response
    const servicesWithAppointments = await Promise.all(
      Array.from(allServiceIds).map(async (sid) => {
        // Try to find in ownedServices first
        let service = ownedServices.find(s => s._id.toString() === sid);
        if (!service) {
          // If not owned, fetch from DB (from booked)
          service = await Service.findById(sid);
        }
        if (!service) return null; // skip if not found
        // If owned, get all appointments for this service
        let appointments = [];
        if (service.userId && service.userId.toString() === userId) {
          appointments = await Appointment.find({ serviceId: sid })
            .select('customerName customerEmail customerPhone date time status userId')
            .sort({ date: 1, time: 1 });
        }
        // Always include user's own bookings for this service
        const myBookings = bookedServiceMap[sid] || [];
        return {
          ...service.toObject(),
          appointments,
          bookedByMe: myBookings.length > 0,
          myAppointments: myBookings
        };
      })
    );
    // Remove any nulls (in case of missing services)
    const filtered = servicesWithAppointments.filter(Boolean);
    res.status(200).json({ success: true, services: filtered });
  } catch (error) {
    console.error('Error fetching my services:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your services', error: error.message });
  }
};

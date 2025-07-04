const Service = require('../models/Service');

// Get all services or filtered by category
exports.getServices = async (req, res, next) => {
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
        next(error);
    }
};

// Get a single service by ID
exports.getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            const error = new Error('Service not found');
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        next(error);
    }
};

// Create sample services (for development only)
exports.createSampleServices = async (req, res, next) => {
    try {
        const count = await Service.countDocuments();

        if (count > 0) {
            const error = new Error('Sample services already exist');
            error.statusCode = 400;
            return next(error);
        }

        const sampleServices = [
            { name: 'Haircut & Styling', category: 'Beauty', description: 'Professional haircut and styling by expert stylists', price: 45, duration: 60, provider: 'Style Studio', location: '123 Fashion Ave' },
            { name: 'Beard Grooming', category: 'Beauty', description: 'Complete beard trim, shape and maintenance', price: 30, duration: 30, provider: 'Men\'s Grooming Center', location: '456 Style Blvd' },
            { name: 'Hair Coloring / Smoothening', category: 'Beauty', description: 'Professional hair coloring or smoothening treatment', price: 80, duration: 120, provider: 'Color Masters', location: '789 Beauty Way' },
            { name: 'Spa & Massage', category: 'Beauty', description: 'Relaxing full body massage and spa treatment', price: 90, duration: 90, provider: 'Relaxation Spa', location: '567 Calm Ave' },
            { name: 'Dental Checkup', category: 'Healthcare', description: 'Complete dental examination and cleaning', price: 120, duration: 60, provider: 'Smile Dentistry', location: '789 Health St' },
            { name: 'Plumbing Repair', category: 'Home Repair', description: 'Professional plumbing repair and maintenance', price: 85, duration: 60, provider: 'Fast Fix Plumbing', location: 'Your Home' },
            { name: 'Car Oil Change', category: 'Automobile', description: 'Quick oil change service for all vehicle types', price: 50, duration: 30, provider: 'Quick Auto Service', location: '321 Motor Dr' }
        ];

        await Service.insertMany(sampleServices);

        res.status(201).json({
            success: true,
            message: 'Sample services created successfully',
            count: sampleServices.length
        });
    } catch (error) {
        next(error);
    }
};

// Add a new service
exports.addService = async (req, res, next) => {
    try {
        const newService = new Service(req.body);
        await newService.save();

        res.status(201).json({
            success: true,
            message: 'Service added successfully',
            service: newService
        });
    } catch (error) {
        error.statusCode = 400;
        next(error);
    }
};

// Get services by category
exports.getServicesByCategory = async (req, res, next) => {
    try {
        const category = req.params.category;
        const services = await Service.find({ category });

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        next(error);
    }
};

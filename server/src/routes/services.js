const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');

// Get all services or filter by category
router.get('/', serviceController.getServices);

// Get a single service by ID
router.get('/:id', serviceController.getServiceById);

// Create sample services (for development only)
router.post('/sample', serviceController.createSampleServices);
// Add a new service
router.post('/', auth, serviceController.addService);

// Get services by category
router.get('/category/:category', serviceController.getServicesByCategory);

// Get all services owned by the logged-in user
router.get('/my', auth, serviceController.getMyServices);

module.exports = router; 


const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');

// Get all services or filter by category
router.get('/', serviceController.getServices);

// Get provider's own services (protected)
router.get('/provider', auth, serviceController.getProviderServices);

// Get a single service by ID
router.get('/:id', serviceController.getServiceById);

// Create sample services (for development only)
router.post('/sample', serviceController.createSampleServices);
// Add a new service (protected)
router.post('/', auth, serviceController.addService);

// Edit a service (provider only)
router.patch('/:id', auth, serviceController.updateService);
// Delete a service (provider only)
router.delete('/:id', auth, serviceController.deleteService);

// Get services by category
router.get('/category/:category', serviceController.getServicesByCategory);

module.exports = router; 


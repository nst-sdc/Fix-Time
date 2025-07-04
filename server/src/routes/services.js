const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// ✅ Get all services or filter by category
router.get('/', serviceController.getServices);

// ✅ Get services by category (MUST be before :id route)
router.get('/category/:category', serviceController.getServicesByCategory);

// ✅ Get a single service by ID
router.get('/:id', serviceController.getServiceById);

// ✅ Create sample services (for development only)
router.post('/sample', serviceController.createSampleServices);

// ✅ Add a new service
router.post('/', serviceController.addService);

module.exports = router;


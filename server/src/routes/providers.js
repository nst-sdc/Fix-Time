const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', providerController.getAllProviders);
router.get('/category/:category', providerController.getProvidersByCategory);
router.get('/:id', providerController.getProviderById);

// Protected routes (authentication required)
router.use(auth);

// Provider dashboard and profile management
router.get('/dashboard/profile', providerController.getProviderDashboard);
router.put('/profile', providerController.updateProviderProfile);

// Service management for providers
router.post('/services', providerController.addServiceToProvider);
router.delete('/services/:serviceId', providerController.removeServiceFromProvider);

module.exports = router; 
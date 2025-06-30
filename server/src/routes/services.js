const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all services or filter by category
router.get('/', serviceController.getServices);

// Get a single service by ID
router.get('/:id', serviceController.getServiceById);

module.exports = router; 
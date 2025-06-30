const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', serviceController.getServices);

module.exports = router; 
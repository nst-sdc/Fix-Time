const express = require('express');
const Service = require('../models/Service'); // ensure path is correct

const router = express.Router();

// POST /services → Add a new service
router.post('/', async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json({ message: 'Service added', service: newService });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /services/:category → Get services by category
router.get('/:category', async (req, res) => {
  try {
    const services = await Service.find({ category: req.params.category });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

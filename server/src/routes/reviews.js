const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// ✅ Route to add a new review (protected)
router.post('/add', auth, reviewController.addReview);

// ✅ Route to get all reviews for a specific service (public)
router.get('/service/:id', reviewController.getServiceReviews);

module.exports = router;

const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const mongoose = require('mongoose');

/**
 * Add a new review for a service after an appointment
 * @route POST /api/reviews/add
 * @access Private - For logged-in users with completed appointments
 */
exports.addReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const userId = req.user.id; // From auth middleware
    
    if (!appointmentId || !rating || !comment) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide appointmentId, rating, and comment' 
      });
    }

    // Validate rating
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ 
        success: false,
        message: 'Rating must be a number between 1 and 5' 
      });
    }
    
    // Check if appointment exists and belongs to the user
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId
    });
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found or does not belong to the user' 
      });
    }
    
    // Check if appointment is completed
    if (appointment.status !== 'completed') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot review an appointment that has not been completed' 
      });
    }
    
    // Check if appointment has already been reviewed
    if (appointment.hasReviewed) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already reviewed this appointment' 
      });
    }
    
    // Create review
    const review = new Review({
      serviceId: appointment.serviceId,
      userId,
      appointmentId,
      rating: ratingNum,
      comment
    });
    
    // Use transaction to ensure data consistency across collections
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Save review
      await review.save({ session });
      
      // Mark appointment as reviewed
      appointment.hasReviewed = true;
      await appointment.save({ session });
      
      // Update service's average rating and total reviews
      const service = await Service.findById(appointment.serviceId);
      
      // Calculate new average rating
      const totalRatingPoints = service.avgRating * service.totalReviews + ratingNum;
      const newTotalReviews = service.totalReviews + 1;
      const newAvgRating = totalRatingPoints / newTotalReviews;
      
      // Update service
      service.avgRating = newAvgRating;
      service.totalReviews = newTotalReviews;
      await service.save({ session });
      
      await session.commitTransaction();
      session.endSession();
      
      return res.status(201).json({
        success: true,
        review,
        message: 'Review submitted successfully'
      });
      
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
    
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while adding review' 
    });
  }
};

/**
 * Get all reviews for a specific service
 * @route GET /api/reviews/service/:id
 * @access Public
 */
exports.getServiceReviews = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if service exists
    const serviceExists = await Service.exists({ _id: id });
    if (!serviceExists) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }
    
    // Get all reviews for the service with user details
    const reviews = await Review.find({ serviceId: id })
      .populate('userId', 'email') // Only populate email from user
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
    
  } catch (error) {
    console.error('Error fetching service reviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching reviews' 
    });
  }
}; 
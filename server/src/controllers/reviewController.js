const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const mongoose = require('mongoose');

// Add a new review
exports.addReview = async (req, res, next) => {
    try {
        const { appointmentId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!appointmentId || !rating || !comment) {
            const error = new Error('Please provide appointmentId, rating, and comment');
            error.statusCode = 400;
            return next(error);
        }

        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            const error = new Error('Rating must be a number between 1 and 5');
            error.statusCode = 400;
            return next(error);
        }

        const appointment = await Appointment.findOne({ _id: appointmentId, userId });
        if (!appointment) {
            const error = new Error('Appointment not found or does not belong to the user');
            error.statusCode = 404;
            return next(error);
        }

        if (appointment.status !== 'completed') {
            const error = new Error('Cannot review an appointment that has not been completed');
            error.statusCode = 400;
            return next(error);
        }

        if (appointment.hasReviewed) {
            const error = new Error('You have already reviewed this appointment');
            error.statusCode = 400;
            return next(error);
        }

        const review = new Review({
            serviceId: appointment.serviceId,
            userId,
            appointmentId,
            rating: ratingNum,
            comment
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await review.save({ session });

            appointment.hasReviewed = true;
            await appointment.save({ session });

            const service = await Service.findById(appointment.serviceId);

            const totalRatingPoints = service.avgRating * service.totalReviews + ratingNum;
            const newTotalReviews = service.totalReviews + 1;
            const newAvgRating = totalRatingPoints / newTotalReviews;

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
            return next(error);
        }

    } catch (error) {
        next(error);
    }
};

// Get all reviews for a specific service
exports.getServiceReviews = async (req, res, next) => {
    try {
        const { id } = req.params;

        const serviceExists = await Service.exists({ _id: id });
        if (!serviceExists) {
            const error = new Error('Service not found');
            error.statusCode = 404;
            return next(error);
        }

        const reviews = await Review.find({ serviceId: id })
            .populate('userId', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        next(error);
    }
};

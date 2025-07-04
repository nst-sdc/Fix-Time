const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

// Create a new appointment
exports.createAppointment = async (req, res, next) => {
    try {
        const {
            serviceId,
            date,
            time,
            notes,
            customerName,
            customerEmail,
            customerPhone
        } = req.body;

        const userId = req.user.id;

        const missingFields = [];
        if (!serviceId) missingFields.push('serviceId');
        if (!date) missingFields.push('date');
        if (!time) missingFields.push('time');
        if (!customerName) missingFields.push('customerName');
        if (!customerEmail) missingFields.push('customerEmail');
        if (!customerPhone) missingFields.push('customerPhone');

        if (missingFields.length > 0) {
            const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
            error.statusCode = 400;
            return next(error);
        }

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            const error = new Error('Invalid date format');
            error.statusCode = 400;
            return next(error);
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            const error = new Error('Service not found');
            error.statusCode = 404;
            return next(error);
        }

        const appointment = new Appointment({
            userId,
            serviceId,
            date,
            time,
            notes: notes || '',
            customerName,
            customerEmail,
            customerPhone,
            status: 'scheduled',
            hasReviewed: false
        });

        await appointment.save();

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('serviceId', 'name category provider location');

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: populatedAppointment
        });
    } catch (error) {
        next(error);
    }
};

// Get all appointments for the logged-in user
exports.getUserAppointments = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const appointments = await Appointment.find({ userId })
            .populate('serviceId', 'name category provider location')
            .sort({ date: 1 });

        const formattedAppointments = appointments.map(appointment => {
            const service = appointment.serviceId;
            return {
                _id: appointment._id,
                serviceName: service ? service.name : 'Unknown Service',
                serviceCategory: service ? service.category : 'Other',
                date: appointment.date,
                time: appointment.time,
                status: appointment.status,
                provider: service ? service.provider : 'Unknown Provider',
                location: service ? service.location : 'Unknown Location',
                notes: appointment.notes,
                hasReviewed: appointment.hasReviewed,
                customerName: appointment.customerName,
                customerEmail: appointment.customerEmail,
                customerPhone: appointment.customerPhone
            };
        });

        res.status(200).json({
            success: true,
            appointments: formattedAppointments
        });
    } catch (error) {
        next(error);
    }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        if (!status || !['scheduled', 'completed', 'cancelled', 'no-show'].includes(status)) {
            const error = new Error('Please provide a valid status');
            error.statusCode = 400;
            return next(error);
        }

        const appointment = await Appointment.findOne({ _id: id, userId });
        if (!appointment) {
            const error = new Error('Appointment not found or you are not authorized');
            error.statusCode = 404;
            return next(error);
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully',
            appointment
        });
    } catch (error) {
        next(error);
    }
};

// Delete an appointment
exports.deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const appointment = await Appointment.findOne({ _id: id, userId });
        if (!appointment) {
            const error = new Error('Appointment not found or you are not authorized');
            error.statusCode = 404;
            return next(error);
        }

        await Appointment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Reschedule an appointment
exports.rescheduleAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;
        const userId = req.user.id;

        if (!date || !time) {
            const error = new Error('Please provide both date and time');
            error.statusCode = 400;
            return next(error);
        }

        const appointment = await Appointment.findOne({ _id: id, userId });
        if (!appointment) {
            const error = new Error('Appointment not found or you are not authorized');
            error.statusCode = 404;
            return next(error);
        }

        appointment.date = date;
        appointment.time = time;
        await appointment.save();

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('serviceId', 'name category provider location');

        res.status(200).json({
            success: true,
            message: 'Appointment rescheduled successfully',
            appointment: populatedAppointment
        });
    } catch (error) {
        next(error);
    }
};

const Provider = require('../models/Provider');
const User = require('../models/User');

// Get all providers
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ isVerified: true })
      .populate('userId', 'fullName email phoneNumber')
      .select('-documents');

    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching providers'
    });
  }
};

// Get providers by category
exports.getProvidersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const providers = await Provider.find({ 
      businessCategory: category,
      isVerified: true 
    })
      .populate('userId', 'fullName email phoneNumber')
      .select('-documents');

    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    console.error('Error fetching providers by category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching providers'
    });
  }
};

// Get provider by ID
exports.getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const provider = await Provider.findById(id)
      .populate('userId', 'fullName email phoneNumber')
      .populate('services', 'name category description price duration');

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider not found'
      });
    }

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching provider'
    });
  }
};

// Update provider profile
exports.updateProviderProfile = async (req, res) => {
  try {
    const { 
      businessName,
      businessDescription,
      businessCategory,
      businessHours,
      location,
      specializations,
      experience
    } = req.body;

    const provider = await Provider.findOne({ userId: req.user.id });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider profile not found'
      });
    }

    // Update fields if provided
    if (businessName) provider.businessName = businessName;
    if (businessDescription) provider.businessDescription = businessDescription;
    if (businessCategory) provider.businessCategory = businessCategory;
    if (businessHours) provider.businessHours = businessHours;
    if (location) provider.location = location;
    if (specializations) provider.specializations = specializations;
    if (experience !== undefined) provider.experience = experience;

    await provider.save();

    res.json({
      success: true,
      message: 'Provider profile updated successfully',
      provider
    });
  } catch (error) {
    console.error('Error updating provider profile:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating provider profile'
    });
  }
};

// Get provider dashboard data
exports.getProviderDashboard = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider profile not found'
      });
    }

    // Get booking statistics
    const Appointment = require('../models/Appointment');
    const Notification = require('../models/Notification');

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      unreadNotifications
    ] = await Promise.all([
      Appointment.countDocuments({ providerId: provider._id }),
      Appointment.countDocuments({ providerId: provider._id, status: 'pending' }),
      Appointment.countDocuments({ providerId: provider._id, status: 'confirmed' }),
      Appointment.countDocuments({ providerId: provider._id, status: 'completed' }),
      Notification.countDocuments({ recipientId: req.user.id, isRead: false })
    ]);

    // Get recent bookings
    const recentBookings = await Appointment.find({ providerId: provider._id })
      .populate('serviceId', 'name category')
      .sort({ bookingRequestedAt: -1 })
      .limit(5);

    // Get recent notifications
    const recentNotifications = await Notification.find({ recipientId: req.user.id })
      .populate('appointmentId', 'customerName serviceId date time')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const dashboardData = {
      provider,
      stats: {
        totalServices: provider.services.length,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        unreadNotifications,
        rating: provider.rating,
        totalReviews: provider.totalReviews,
        isVerified: provider.isVerified
      },
      recentBookings: recentBookings.map(booking => ({
        _id: booking._id,
        serviceName: booking.serviceId ? booking.serviceId.name : 'Unknown Service',
        customerName: booking.customerName,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        bookingRequestedAt: booking.bookingRequestedAt
      })),
      recentNotifications: recentNotifications.map(notification => ({
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        timeAgo: notification.timeAgo
      }))
    };

    res.json({
      success: true,
      dashboard: dashboardData
    });
  } catch (error) {
    console.error('Error fetching provider dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching dashboard'
    });
  }
};

// Add service to provider
exports.addServiceToProvider = async (req, res) => {
  try {
    const { serviceId } = req.body;
    
    const provider = await Provider.findOne({ userId: req.user.id });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider profile not found'
      });
    }

    if (!provider.services.includes(serviceId)) {
      provider.services.push(serviceId);
      await provider.save();
    }

    res.json({
      success: true,
      message: 'Service added to provider successfully',
      provider
    });
  } catch (error) {
    console.error('Error adding service to provider:', error);
    res.status(500).json({
      success: false,
      error: 'Server error adding service'
    });
  }
};

// Remove service from provider
exports.removeServiceFromProvider = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const provider = await Provider.findOne({ userId: req.user.id });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider profile not found'
      });
    }

    provider.services = provider.services.filter(id => id.toString() !== serviceId);
    await provider.save();

    res.json({
      success: true,
      message: 'Service removed from provider successfully',
      provider
    });
  } catch (error) {
    console.error('Error removing service from provider:', error);
    res.status(500).json({
      success: false,
      error: 'Server error removing service'
    });
  }
}; 
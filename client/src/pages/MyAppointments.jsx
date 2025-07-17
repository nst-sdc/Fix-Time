import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaFilter,
  FaSort,
  FaEye,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaExclamationTriangle
} from 'react-icons/fa';
import './MyAppointments.css';
import { isPastAppointment } from '../utils/serviceUtils';
import { API_BASE_URL } from '../App';

// Add a helper to get the display status
function getDisplayStatus(appointment) {
  if ((appointment.status === 'scheduled' || appointment.status === 'confirmed') && isPastAppointment(appointment.date, appointment.time)) {
    return 'completed';
  }
  return appointment.status;
}

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load appointments');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <FaCalendarAlt className="status-icon scheduled" />;
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      case 'no-show':
        return <FaExclamationTriangle className="status-icon no-show" />;
      case 'in-progress':
        return <FaHourglassHalf className="status-icon in-progress" />;
      case 'confirmed':
        return <FaCheckCircle className="status-icon confirmed" />;
      default:
        return <FaHourglassHalf className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return '#3b82f6';
      case 'confirmed':
        return '#059669';
      case 'in-progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      case 'no-show':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'confirmed':
        return 'Confirmed';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no-show':
        return 'No Show';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Your appointment is scheduled and waiting for confirmation';
      case 'confirmed':
        return 'Your appointment has been confirmed by the provider';
      case 'in-progress':
        return 'Your appointment is currently in progress';
      case 'completed':
        return 'Your appointment has been completed successfully';
      case 'cancelled':
        return 'Your appointment has been cancelled';
      case 'no-show':
        return 'You did not attend your scheduled appointment';
      default:
        return 'Appointment status information';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const filteredAndSortedAppointments = appointments
    .filter(appointment => appointment.serviceName !== 'Unknown Service')
    .filter(appointment => {
      // Status filter
      const statusMatch = filterStatus === 'all' || appointment.status === filterStatus;
      
      // Search filter
      const searchMatch = !searchTerm || 
        appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date range filter
      let dateMatch = true;
      if (dateRange.start || dateRange.end) {
        const appointmentDate = new Date(appointment.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && endDate) {
          dateMatch = appointmentDate >= startDate && appointmentDate <= endDate;
        } else if (startDate) {
          dateMatch = appointmentDate >= startDate;
        } else if (endDate) {
          dateMatch = appointmentDate <= endDate;
        }
      }
      
      return statusMatch && searchMatch && dateMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'time':
          return a.time.localeCompare(b.time);
        case 'service':
          return a.serviceName.localeCompare(b.serviceName);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedAppointment(null);
  };

  const openReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Calculate appropriate initial date:
    // Use appointment date if it's in the future, otherwise use tomorrow
    const appointmentDate = new Date(appointment.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Use the later of appointment date or tomorrow
    const initialDate = appointmentDate > tomorrow ? appointmentDate : tomorrow;
    
    // Format as YYYY-MM-DD for the date input
    setRescheduleDate(initialDate.toISOString().split('T')[0]);
    
    setRescheduleTime(appointment.time);
    setShowReschedule(true);
  };

  const closeReschedule = () => {
    setShowReschedule(false);
    setSelectedAppointment(null);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time');
      return;
    }

    // Check if the selected date and time are valid for rescheduling
    if (selectedAppointment) {
      const currentAppointmentDate = new Date(selectedAppointment.date);
      
      // Parse the selected date
      const newDateObj = new Date(rescheduleDate);
      
      // Parse the selected time
      const [time, period] = rescheduleTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      // Set the time on the new date
      newDateObj.setHours(hour, parseInt(minutes), 0);
      
      // Check if the new date/time is after the current appointment
      if (newDateObj <= currentAppointmentDate) {
        alert('Please select a date and time after the current appointment');
        return;
      }
      
      // Check if the new date/time is in the past
      if (newDateObj <= new Date()) {
        alert('Please select a future date and time');
        return;
      }
    }

    try {
      setRescheduling(true);
      const token = localStorage.getItem('token');
      
      console.log('Sending reschedule request:', {
        appointmentId: selectedAppointment._id,
        date: rescheduleDate,
        time: rescheduleTime,
        token: token ? 'present' : 'missing'
      });

      const response = await axios.put(
        `${API_BASE_URL}/appointments/${selectedAppointment._id}/reschedule`,
        {
          date: rescheduleDate,
          time: rescheduleTime
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Reschedule response:', response.data);

      if (response.data.success) {
        // Update localStorage for consistency across components
        const appointmentsInStorage = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Update the appointment in the array or add if not exists
        const updatedAppointments = appointmentsInStorage.map(appt => 
          appt._id === selectedAppointment._id ? response.data.appointment : appt
        );
        
        if (!appointmentsInStorage.find(appt => appt._id === selectedAppointment._id)) {
          updatedAppointments.push(response.data.appointment);
        }
        
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        localStorage.setItem('appointmentUpdated', 'true');
        
        alert('Appointment rescheduled successfully!');
        fetchAppointments(); // Refresh the appointments list
        closeReschedule();
      } else {
        alert(`Failed to reschedule appointment: ${response.data.message}`);
      }
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to reschedule appointment: ${err.response?.data?.message || err.message}`);
    } finally {
      setRescheduling(false);
    }
  };

  const getStatusCount = (status) => {
    return appointments.filter(app => app.status === status && app.serviceName !== 'Unknown Service').length;
  };

  // Mobile swipe functionality
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (appointment) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Left swipe - show quick actions
      handleQuickAction(appointment, 'view');
    } else if (isRightSwipe) {
      // Right swipe - depends on appointment status
      if (['scheduled', 'confirmed'].includes(appointment.status)) {
        // Show menu of actions
        const action = window.confirm(
          'What would you like to do with this appointment?\n\n' +
          'OK - Reschedule\n' +
          'Cancel - Cancel Appointment'
        );
        
        if (action) {
          // User clicked OK - Reschedule
        handleQuickAction(appointment, 'reschedule');
        } else {
          // User clicked Cancel - Cancel appointment
          handleQuickAction(appointment, 'cancel');
        }
      }
    }
  };

  const handleQuickAction = (appointment, action) => {
    switch (action) {
      case 'view':
        handleAppointmentClick(appointment);
        break;
      case 'reschedule':
        openReschedule(appointment);
        break;
      case 'cancel':
        cancelAppointment(appointment._id);
        break;
      default:
        break;
    }
  };

  // Add a function to cancel appointments
  const cancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const token = localStorage.getItem('token');
        
        // Call API to update appointment status
        const response = await axios.patch(
          `${API_BASE_URL}/appointments/${id}/status`,
          { status: 'cancelled' },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data && response.data.success) {
          // Update local state
          const updatedAppointments = appointments.map(appt => 
            appt._id === id ? { ...appt, status: 'cancelled' } : appt
          );
          setAppointments(updatedAppointments);
          
          // Update localStorage for consistency across components
          localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
          localStorage.setItem('appointmentUpdated', 'true');
          
          // Close the details modal
          closeDetails();
          
          // Show success message
          alert('Appointment cancelled successfully');
        } else {
          alert('Failed to cancel appointment. Please try again.');
        }
      } catch (err) {
        console.error('Error cancelling appointment:', err);
        alert('Error cancelling appointment. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner"></div>
        <p>Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="appointments-container">
      <div className="appointments-card">
        <div className="appointments-header">
          <div className="header-content">
            <h1 className="page-title">My Appointments</h1>
            <p className="page-subtitle">Manage and track all your scheduled appointments</p>
          </div>
          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-number">{appointments.filter(app => app.serviceName !== 'Unknown Service').length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getStatusCount('scheduled') + getStatusCount('confirmed')}</span>
              <span className="stat-label">Upcoming</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getStatusCount('completed')}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getStatusCount('cancelled') + getStatusCount('no-show')}</span>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="controls-section">
          <div className="search-section">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                style={{ display: searchTerm ? 'block' : 'none' }}
              >
                ×
              </button>
            </div>
          </div>

          <div className="filter-controls">
            <div className="date-range-group">
              <div className="date-input-group">
                <label htmlFor="start-date">From:</label>
                <input
                  type="date"
                  id="start-date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="end-date">To:</label>
                <input
                  type="date"
                  id="end-date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="date-input"
                />
              </div>
              <button 
                className="clear-date-btn"
                onClick={() => setDateRange({ start: '', end: '' })}
                style={{ display: (dateRange.start || dateRange.end) ? 'block' : 'none' }}
              >
                Clear
              </button>
            </div>

            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
            
            <div className="sort-group">
              <FaSort className="sort-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Sort by Date</option>
                <option value="time">Sort by Time</option>
                <option value="service">Sort by Service</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAndSortedAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaCalendarAlt />
            </div>
            <h3>No appointments found</h3>
            <p>
              {filterStatus === 'all' 
                ? "You don't have any appointments yet. Book your first appointment to get started!"
                : `No ${filterStatus} appointments found.`
              }
            </p>
            {filterStatus === 'all' && (
              <button 
                className="book-appointment-btn"
                onClick={() => navigate('/appointments')}
              >
                Book Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="appointments-grid">
            {filteredAndSortedAppointments.map((appointment) => (
              <div 
                key={appointment._id} 
                className="appointment-card"
                onClick={() => handleAppointmentClick(appointment)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd(appointment)}
              >
                <div className="appointment-header">
                  <div className="service-info">
                    <h3 className="service-name">{appointment.serviceName}</h3>
                    <span className="service-category">{appointment.serviceCategory}</span>
                  </div>
                  <div className={`status-badge booking-status ${
                    appointment.status === 'scheduled'
                      ? 'scheduled-blue'
                      : appointment.status === 'cancelled'
                      ? 'cancelled-red'
                      : appointment.status
                      ? appointment.status.toLowerCase()
                      : ''
                  }`}>
                    {getStatusIcon(appointment.status)}
                    <span>{getStatusText(appointment.status)}</span>
                  </div>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <span>{formatTime(appointment.time)}</span>
                  </div>
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{appointment.location}</span>
                  </div>
                  <div className="detail-item">
                    <FaUser className="detail-icon" />
                    <span>{appointment.provider}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="appointment-notes">
                    <p>{appointment.notes}</p>
                  </div>
                )}

                <div className="appointment-actions">
                  <button className="view-details-btn">
                    <FaEye />
                    View Details
                  </button>
                  {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && !isPastAppointment(appointment.date, appointment.time) && (
                    <>
                    <button 
                      className="reschedule-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openReschedule(appointment);
                      }}
                    >
                      <FaCalendarAlt />
                      Reschedule
                    </button>
                      <button 
                        className="cancel-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelAppointment(appointment._id);
                        }}
                      >
                        <FaTimesCircle />
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === 'completed' && !appointment.hasReviewed && (
                    <button className="review-btn">
                      <FaStar />
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAppointment.serviceName}</h2>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Appointment Details</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(selectedAppointment.date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{formatTime(selectedAppointment.time)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      <div className="status-detail-container">
                        <span
                          className={`status-indicator booking-status ${
                            selectedAppointment.status === 'scheduled'
                              ? 'scheduled-blue'
                              : selectedAppointment.status === 'cancelled'
                              ? 'cancelled-red'
                              : selectedAppointment.status
                              ? selectedAppointment.status.toLowerCase()
                              : ''
                          }`}
                        >
                          {getStatusIcon(selectedAppointment.status)}
                          {getStatusText(selectedAppointment.status)}
                        </span>
                        <p className="status-description">{getStatusDescription(getDisplayStatus(selectedAppointment))}</p>
                      </div>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Provider:</span>
                    <span className="detail-value">{selectedAppointment.provider}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{selectedAppointment.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{selectedAppointment.serviceCategory}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedAppointment.customerName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedAppointment.customerEmail}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedAppointment.customerPhone}</span>
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="detail-section">
                  <h3>Notes</h3>
                  <div className="notes-container">
                    <p className="notes-text">{selectedAppointment.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {(selectedAppointment.status === 'scheduled' || selectedAppointment.status === 'confirmed') && !isPastAppointment(selectedAppointment.date, selectedAppointment.time) && (
                <>
                <button 
                  className="reschedule-btn"
                  onClick={() => {
                    closeDetails();
                    openReschedule(selectedAppointment);
                  }}
                >
                  <FaCalendarAlt />
                  Reschedule
                </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => cancelAppointment(selectedAppointment._id)}
                  >
                    <FaTimesCircle />
                    Cancel Appointment
                  </button>
                </>
              )}
              {selectedAppointment.status === 'completed' && !selectedAppointment.hasReviewed && (
                <button className="review-btn">
                  <FaStar />
                  Leave Review
                </button>
              )}
              <button className="close-modal-btn" onClick={closeDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showReschedule && selectedAppointment && (
        <div className="modal-overlay" onClick={closeReschedule}>
          <div className="modal-content reschedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reschedule Appointment</h2>
            </div>
            
            <div className="modal-body">
              <div className="reschedule-info">
                <h3>Current Appointment</h3>
                <p><strong>Service:</strong> {selectedAppointment.serviceName}</p>
                <p><strong>Current Date:</strong> {formatDate(selectedAppointment.date)}</p>
                <p><strong>Current Time:</strong> {formatTime(selectedAppointment.time)}</p>
              </div>

              <div className="reschedule-form">
                <h3>New Date & Time</h3>
                <div className="form-group">
                  <label htmlFor="reschedule-date">Date:</label>
                  <input
                    type="date"
                    id="reschedule-date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    min={
                      selectedAppointment 
                        ? new Date(selectedAppointment.date) > new Date() 
                          ? new Date(selectedAppointment.date).toISOString().split('T')[0] 
                          : new Date().toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="reschedule-time">Time:</label>
                  <select
                    id="reschedule-time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Time</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="confirm-reschedule-btn"
                onClick={handleReschedule}
                disabled={rescheduling}
              >
                {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
              <button className="close-modal-btn" onClick={closeReschedule}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments; 
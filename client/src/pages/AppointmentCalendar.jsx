import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './AppointmentCalendar.css';
import { FaFilter, FaCalendarDay, FaTimes, FaEdit, FaTrash, FaMapMarkerAlt, FaBuilding, FaClock, FaCalendarAlt, FaStickyNote, FaChevronDown, FaSync, FaAngleUp, FaAngleDown, FaCalendarWeek } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { isPastAppointment } from '../utils/serviceUtils';

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [viewType, setViewType] = useState('dayGridMonth');
  const calendarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Service categories with their corresponding colors
  const categoryColors = {
    'Healthcare': '#4287f5', // blue
    'Beauty': '#f542a7',     // pink
    'Home Repair': '#42f5b3', // mint green
    'Automobile': '#f5a742',  // orange
    'Education': '#9d42f5',   // purple
    'Government': '#42bcf5',  // light blue
    'Restaurant': '#f54242',  // red
    'Retail': '#42f54e',      // green
    'Events': '#f5e642',      // yellow
    'default': '#6c757d'      // gray
  };

  // Fetch appointments data
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        setError('Please log in to view your appointments');
        setLoading(false);
        return;
      }
      
      // Fetch appointments from API
      const response = await axios.get('http://localhost:5001/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        setAppointments(response.data.appointments);
        
        // Also update localStorage for other components that might use it
        localStorage.setItem('appointments', JSON.stringify(response.data.appointments));
        localStorage.setItem('appointmentUpdated', 'false');
      } else {
        throw new Error(response.data?.message || 'Failed to fetch appointments');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
      setLoading(false);
    }
  };

  // Use effect to fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Use effect to check for appointment updates in localStorage
  useEffect(() => {
    // Check if there are any appointment updates in localStorage
    const appointmentUpdated = localStorage.getItem('appointmentUpdated');
    const storedAppointments = localStorage.getItem('appointments');
    
    if (appointmentUpdated === 'true' && storedAppointments) {
      try {
        const updatedAppointments = JSON.parse(storedAppointments);
        setAppointments(prevAppointments => {
          // Merge the updated appointments with existing ones
          const merged = [...prevAppointments];
          
          updatedAppointments.forEach(updatedAppt => {
            const index = merged.findIndex(appt => appt._id === updatedAppt._id);
            if (index !== -1) {
              merged[index] = updatedAppt;
            } else {
              merged.push(updatedAppt);
            }
          });
          
          return merged;
        });
        
        // Clear the update flag
        localStorage.setItem('appointmentUpdated', 'false');
        
        // Show notification
        setNotification({
          show: true,
          message: 'Calendar updated with rescheduled appointment'
        });
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, message: '' });
        }, 3000);
      } catch (error) {
        console.error('Error parsing appointments from localStorage:', error);
      }
    }
  }, []);

  // Check if we're coming from the reschedule page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const fromReschedule = searchParams.get('fromReschedule');
    
    if (fromReschedule === 'true') {
      // Clear the parameter from URL without page refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Show notification
      setNotification({
        show: true,
        message: 'Calendar updated with rescheduled appointment'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 3000);
      
      // Refresh appointments
      fetchAppointments();
    }
  }, [location.search]);

  // Format appointments for FullCalendar
  const filteredAppointments = appointments.filter(appt => appt.serviceName !== 'Unknown Service');
  const formattedEvents = filteredAppointments
    .filter(appt => 
      // Only show appointments that aren't cancelled AND match the category filter
      (categoryFilter === 'all' || appt.serviceCategory === categoryFilter) && 
      appt.status !== 'cancelled'
    )
    .map(appointment => {
      const [time, period] = appointment.time.split(' ');
      const [hours, minutes] = time.split(':');
      
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(hour);
      appointmentDate.setMinutes(parseInt(minutes));

      return {
        id: appointment._id,
        title: appointment.serviceName,
        start: appointmentDate,
        backgroundColor: categoryColors[appointment.serviceCategory] || categoryColors.default,
        borderColor: categoryColors[appointment.serviceCategory] || categoryColors.default,
        extendedProps: appointment
      };
    });

  // Handle event click to open modal
  const handleEventClick = (clickInfo) => {
    setSelectedAppointment(clickInfo.event.extendedProps);
    setModalOpen(true);
  };

  // Handle today button click
  const goToToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  // Handle view change
  const handleViewChange = (viewType) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewType);
      setViewType(viewType);
    }
  };

  // Cancel appointment function - calls the API
  const cancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const token = localStorage.getItem('token');
        
        // Call API to update appointment status
        const response = await axios.patch(
          `http://localhost:5001/appointments/${id}/status`,
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
          
          // Show notification
          setNotification({
            show: true,
            message: 'Appointment cancelled successfully'
          });
          
          // Hide notification after 3 seconds
          setTimeout(() => {
            setNotification({ show: false, message: '' });
          }, 3000);
          
          closeModal();
        } else {
          alert('Failed to cancel appointment. Please try again.');
        }
      } catch (err) {
        console.error('Error cancelling appointment:', err);
        alert('Error cancelling appointment. Please try again.');
      }
    }
  };

  // Reschedule appointment function
  const rescheduleAppointment = (id) => {
    closeModal();
    navigate(`/reschedule?id=${id}`);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(appointments.map(appt => appt.serviceCategory))];

  if (loading) {
    return (
      <motion.div 
        className="calendar-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="spinner"></div>
        <p>Loading your appointments...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="calendar-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Error loading appointments</h3>
        <p>{error}</p>
        <button 
          className="retry-button" 
          onClick={fetchAppointments}
        >
          <FaSync /> Retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="calendar-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {notification.show && (
        <motion.div 
          className="calendar-notification"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {notification.message}
        </motion.div>
      )}
      
      <div className="calendar-header">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Appointment Calendar
        </motion.h1>
        <motion.div 
          className="calendar-actions"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button className="today-btn" onClick={goToToday}>
            <FaCalendarDay /> Today
          </button>
          
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewType === 'dayGridMonth' ? 'active' : ''}`} 
              onClick={() => handleViewChange('dayGridMonth')}
            >
              <FaCalendarAlt /> Month
            </button>
            <button 
              className={`view-btn ${viewType === 'timeGridWeek' ? 'active' : ''}`} 
              onClick={() => handleViewChange('timeGridWeek')}
            >
              <FaCalendarWeek /> Week
            </button>
            <button 
              className={`view-btn ${viewType === 'timeGridDay' ? 'active' : ''}`} 
              onClick={() => handleViewChange('timeGridDay')}
            >
              <FaCalendarDay /> Day
            </button>
          </div>
          
          <div className="filter-dropdown">
            <button className="filter-btn" onClick={toggleFilterDropdown}>
              <FaFilter /> Filter <FaChevronDown className={filterDropdownOpen ? 'rotate' : ''} />
            </button>
            
            <AnimatePresence>
              {filterDropdownOpen && (
                <motion.div 
                  className="filter-options"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'block' }}
                >
                  {categories.map(category => (
                    <button 
                      key={category} 
                      className={`category-filter-btn ${categoryFilter === category ? 'active' : ''}`}
                      onClick={() => {
                        setCategoryFilter(category);
                        setFilterDropdownOpen(false);
                      }}
                    >
                      {category === 'all' ? 'All Categories' : category}
                      {category !== 'all' && (
                        <span 
                          className="category-color" 
                          style={{backgroundColor: categoryColors[category] || categoryColors.default}}
                        ></span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="calendar-view"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: ''
          }}
          events={formattedEvents}
          eventClick={handleEventClick}
          height="auto"
          expandRows={true}
          dayMaxEvents={3}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
        />
      </motion.div>

      {appointments.length === 0 && (
        <motion.div 
          className="empty-calendar-state"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3>No Appointments Yet</h3>
          <p>You don't have any scheduled appointments. Ready to book your first?</p>
          <a href="/appointments" className="book-appointment-btn">Book Your First Appointment</a>
        </motion.div>
      )}

      <AnimatePresence>
        {modalOpen && selectedAppointment && (
          <motion.div 
            className="appointment-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              <div className="modal-header">
                <h2>{selectedAppointment.serviceName}</h2>
                <span className={`appointment-status status-${selectedAppointment.status}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="modal-body">
                <div className="modal-details">
                  <div className="detail-item">
                    <strong>Date</strong>
                    <div className="detail-content">
                      <FaCalendarAlt className="detail-icon" />
                      {formatDate(selectedAppointment.date)}
                    </div>
                  </div>
                  <div className="detail-item">
                    <strong>Time</strong>
                    <div className="detail-content">
                      <FaClock className="detail-icon" />
                      {selectedAppointment.time}
                    </div>
                  </div>
                  <div className="detail-item">
                    <strong>Provider</strong>
                    <div className="detail-content">
                      <FaBuilding className="detail-icon" />
                      {selectedAppointment.provider}
                    </div>
                  </div>
                  <div className="detail-item">
                    <strong>Location</strong>
                    <div className="detail-content">
                      <FaMapMarkerAlt className="detail-icon" />
                      {selectedAppointment.location}
                    </div>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="detail-item">
                      <strong>Notes</strong>
                      <div className="detail-content">
                        <FaStickyNote className="detail-icon" />
                        {selectedAppointment.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                {selectedAppointment.status === 'scheduled' && (
                  <>
                    <button 
                      className="reschedule-btn"
                      onClick={() => rescheduleAppointment(selectedAppointment._id)}
                      disabled={isPastAppointment(selectedAppointment.date, selectedAppointment.time)}
                      title={isPastAppointment(selectedAppointment.date, selectedAppointment.time) ? 'Cannot reschedule past appointments' : ''}
                    >
                      <FaEdit /> Reschedule
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => cancelAppointment(selectedAppointment._id)}
                      disabled={isPastAppointment(selectedAppointment.date, selectedAppointment.time)}
                      title={isPastAppointment(selectedAppointment.date, selectedAppointment.time) ? 'Cannot cancel past appointments' : ''}
                    >
                      <FaTrash /> Cancel
                    </button>
                  </>
                )}
                {selectedAppointment.status === 'completed' && !selectedAppointment.hasReviewed && (
                  <a href={`/appointments#review-${selectedAppointment._id}`} className="leave-review-btn">
                    Leave a Review
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AppointmentCalendar; 
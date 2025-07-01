import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './AppointmentCalendar.css';
import { FaFilter, FaCalendarDay, FaTimes, FaEdit, FaTrash, FaMapMarkerAlt, FaBuilding, FaClock, FaCalendarAlt, FaStickyNote, FaChevronDown, FaSync } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [viewType, setViewType] = useState('dayGridMonth');
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);
  const calendarRef = useRef(null);

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

  // Available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
  ];

  // Fetch real appointments from the API
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("No authentication token found");
        setError('You must be logged in to view appointments');
        setLoading(false);
        return;
      }
      
      console.log("Fetching appointments...");
      
      // Fetch appointments from API with timeout
      const response = await axios.get('http://localhost:5001/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log("Appointments response:", response.data);
      
      if (response.data && response.data.success) {
        if (response.data.appointments && response.data.appointments.length > 0) {
          console.log("Loaded", response.data.appointments.length, "appointments");
          setAppointments(response.data.appointments);
        } else {
          console.log("No appointments found");
          setAppointments([]);
        }
      } else {
        console.error("Failed response structure:", response.data);
        throw new Error(response.data?.message || 'Failed to load appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      
      // More detailed error reporting
      let errorMessage = 'Error loading appointments. Please try again.';
      
      if (err.response) {
        console.error('Server response:', err.response.data);
        console.error('Status code:', err.response.status);
        errorMessage = `Error ${err.response.status}: ${err.response.data?.message || 'Unknown server error'}`;
      } else if (err.request) {
        console.error('No response received:', err.request);
        errorMessage = 'Server did not respond. Please check your connection.';
        
        // Check if it's a timeout
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. The server is taking too long to respond.';
        }
      } else {
        console.error('Error message:', err.message);
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Format appointments for FullCalendar
  const formattedEvents = appointments
    .filter(appt => categoryFilter === 'all' || appt.serviceCategory === categoryFilter)
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
          closeModal();
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

  // Reschedule appointment function
  const rescheduleAppointment = (id) => {
    closeModal();
    setSelectedAppointment(appointments.find(appt => appt._id === id));
    setRescheduleModalOpen(true);
  };

  // Handle reschedule submission
  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time');
      return;
    }

    setRescheduling(true);
    try {
      const token = localStorage.getItem('token');
      
      console.log('Calendar: Rescheduling appointment:', selectedAppointment._id);
      console.log('Calendar: New date:', rescheduleDate);
      console.log('Calendar: New time:', rescheduleTime);

      const response = await axios.put(
        `http://localhost:5001/appointments/${selectedAppointment._id}/reschedule`,
        {
          date: rescheduleDate,
          time: rescheduleTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Calendar: Reschedule response:', response.data);

      if (response.data && response.data.success) {
        // Update local state
        const updatedAppointments = appointments.map(appt => 
          appt._id === selectedAppointment._id 
            ? { ...appt, date: rescheduleDate, time: rescheduleTime }
            : appt
        );
        setAppointments(updatedAppointments);
        
        // Close modals and reset state
        setRescheduleModalOpen(false);
        setRescheduleDate('');
        setRescheduleTime('');
        setSelectedAppointment(null);
        
        alert('Appointment rescheduled successfully!');
      } else {
        alert('Failed to reschedule appointment. Please try again.');
      }
    } catch (err) {
      console.error('Calendar: Error rescheduling appointment:', err);
      let errorMessage = 'Error rescheduling appointment. Please try again.';
      
      if (err.response) {
        console.error('Calendar: Server response:', err.response.data);
        errorMessage = err.response.data?.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setRescheduling(false);
    }
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
              Month
            </button>
            <button 
              className={`view-btn ${viewType === 'timeGridWeek' ? 'active' : ''}`} 
              onClick={() => handleViewChange('timeGridWeek')}
            >
              Week
            </button>
            <button 
              className={`view-btn ${viewType === 'timeGridDay' ? 'active' : ''}`} 
              onClick={() => handleViewChange('timeGridDay')}
            >
              Day
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
          <a href="/services" className="book-appointment-btn">Book Your First Appointment</a>
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
                ×
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
                    >
                      <FaEdit /> Reschedule
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => cancelAppointment(selectedAppointment._id)}
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

      {rescheduleModalOpen && (
        <motion.div 
          className="reschedule-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal-btn" onClick={() => {
              setRescheduleModalOpen(false);
              setRescheduleDate('');
              setRescheduleTime('');
            }}>
              ×
            </button>
            <div className="modal-header">
              <h2>Reschedule Appointment</h2>
            </div>
            <div className="modal-body">
              <div className="reschedule-form">
                <div className="form-group">
                  <label htmlFor="reschedule-date">Date</label>
                  <input
                    type="date"
                    id="reschedule-date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reschedule-time">Time</label>
                  <select
                    id="reschedule-time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
                         <div className="modal-actions">
               <button 
                 className="cancel-btn"
                 onClick={() => {
                   setRescheduleModalOpen(false);
                   setRescheduleDate('');
                   setRescheduleTime('');
                 }}
                 disabled={rescheduling}
               >
                 Cancel
               </button>
               <button 
                 className="reschedule-btn"
                 onClick={handleReschedule}
                 disabled={rescheduling || !rescheduleDate || !rescheduleTime}
               >
                 {rescheduling ? 'Rescheduling...' : 'Reschedule'}
               </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AppointmentCalendar; 
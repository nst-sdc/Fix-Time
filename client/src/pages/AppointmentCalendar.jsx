import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './AppointmentCalendar.css';
import { FaFilter, FaCalendarDay, FaTimes, FaEdit, FaTrash, FaMapMarkerAlt, FaBuilding, FaClock, FaCalendarAlt, FaStickyNote, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Mock appointments data - in a real app, would come from API
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    
    setTimeout(() => {
      // Mock data with more service categories
      const mockAppointments = [
        {
          _id: 'appt-001',
          serviceName: 'Haircut & Styling',
          serviceCategory: 'Beauty',
          date: new Date(Date.now() + 86400000 * 3), // 3 days from now
          time: '10:00 AM',
          status: 'scheduled',
          provider: 'Style Studio',
          location: '123 Fashion Ave',
          notes: 'Please arrive 10 minutes early'
        },
        {
          _id: 'appt-002',
          serviceName: 'Beard Grooming',
          serviceCategory: 'Beauty',
          date: new Date(Date.now() + 86400000 * 7), // 7 days from now
          time: '2:30 PM',
          status: 'scheduled',
          provider: 'Men\'s Grooming Center',
          location: '456 Style Blvd',
          notes: 'Bring reference photos if you have them'
        },
        {
          _id: 'appt-003',
          serviceName: 'Dental Checkup',
          serviceCategory: 'Healthcare',
          date: new Date(Date.now() + 86400000 * 5), // 5 days from now
          time: '9:00 AM',
          status: 'scheduled',
          provider: 'Smile Dentistry',
          location: '789 Health St',
          notes: 'Annual checkup and cleaning'
        },
        {
          _id: 'appt-004',
          serviceName: 'Car Oil Change',
          serviceCategory: 'Automobile',
          date: new Date(Date.now() + 86400000 * 2), // 2 days from now
          time: '11:00 AM',
          status: 'scheduled',
          provider: 'Quick Auto Service',
          location: '321 Motor Dr',
          notes: 'Full synthetic oil requested'
        },
        {
          _id: 'appt-005',
          serviceName: 'Spa & Massage',
          serviceCategory: 'Beauty',
          date: new Date(Date.now() - 86400000 * 5), // 5 days ago
          time: '3:30 PM',
          status: 'completed',
          hasReviewed: true,
          provider: 'Relaxation Spa',
          location: '567 Calm Ave',
          notes: 'Hot stone massage'
        },
        {
          _id: 'appt-006',
          serviceName: 'Plumbing Repair',
          serviceCategory: 'Home Repair',
          date: new Date(Date.now() + 86400000 * 1), // Tomorrow
          time: '1:00 PM',
          status: 'scheduled',
          provider: 'Fast Fix Plumbing',
          location: 'Your Home',
          notes: 'Leaky faucet in master bathroom'
        }
      ];
      
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
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

  // Mock cancel appointment function
  const cancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      // In a real app, you would make an API call here
      const updatedAppointments = appointments.map(appt => 
        appt._id === id ? { ...appt, status: 'cancelled' } : appt
      );
      setAppointments(updatedAppointments);
      closeModal();
      alert('Appointment cancelled successfully');
    }
  };

  // Mock reschedule appointment function
  const rescheduleAppointment = (id) => {
    closeModal();
    // In a real app, this would open a form to reschedule
    alert('Reschedule functionality would open here');
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
        <button onClick={() => window.location.reload()}>Retry</button>
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
    </motion.div>
  );
};

export default AppointmentCalendar; 
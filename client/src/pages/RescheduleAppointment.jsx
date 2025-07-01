import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaArrowLeft, FaCheck } from 'react-icons/fa';
import './RescheduleAppointment.css';

const RescheduleAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Generate date options (current date + 14 days)
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      
      options.push(formattedDate);
    }
    
    return options;
  };

  const dateOptions = generateDateOptions();
  
  // Generate time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  useEffect(() => {
    // Extract appointment ID from URL parameters
    const searchParams = new URLSearchParams(location.search);
    const appointmentId = searchParams.get('id');
    
    if (!appointmentId) {
      setError('Appointment ID is missing');
      setLoading(false);
      return;
    }
    
    // In a real app, fetch the appointment details from the server
    // For this example, we'll simulate an API call with mock data
    const fetchAppointment = async () => {
      try {
        // In a real app, replace this with actual API call
        // const response = await axios.get(`/api/appointments/${appointmentId}`);
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockAppointment = {
            _id: appointmentId,
            serviceName: 'Haircut & Styling',
            date: new Date(),
            time: '1:00 PM',
            provider: 'Style Studio',
            location: '123 Beauty Ave',
            notes: 'Haircut & Styling',
            status: 'scheduled'
          };
          
          setAppointment(mockAppointment);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError('Failed to load appointment details');
        setLoading(false);
      }
    };
    
    fetchAppointment();
  }, [location.search]);

  const handleReschedule = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // In a real app, make an API call to update the appointment
      // const response = await axios.patch(`/api/appointments/${appointment._id}/reschedule`, {
      //   date: selectedDate,
      //   time: selectedTime
      // });
      
      // Simulate API call
      setTimeout(() => {
        // Create a new date object from the selected date string
        const dateParts = selectedDate.split(' ');
        const month = new Date(Date.parse(dateParts[1] + " 1, 2000")).getMonth();
        const day = parseInt(dateParts[2]);
        const today = new Date();
        const newDate = new Date(today.getFullYear(), month, day);
        
        // Create updated appointment object
        const updatedAppointment = {
          ...appointment,
          date: newDate.toISOString(),
          time: selectedTime,
          lastUpdated: new Date().toISOString()
        };
        
        // Store in localStorage to communicate with calendar component
        const appointmentsInStorage = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Update the appointment in the array or add if not exists
        const updatedAppointments = appointmentsInStorage.map(appt => 
          appt._id === appointment._id ? updatedAppointment : appt
        );
        
        if (!appointmentsInStorage.find(appt => appt._id === appointment._id)) {
          updatedAppointments.push(updatedAppointment);
        }
        
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        localStorage.setItem('appointmentUpdated', 'true');
        
        setSuccess(true);
        setSubmitting(false);
      }, 1500);
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      setError('Failed to reschedule. Please try again.');
      setSubmitting(false);
    }
  };

  const goBack = () => {
    navigate(-1); // Navigate back to previous page
  };
  
  const goToDashboard = () => {
    navigate('/dashboard');
  };
  
  const goToCalendar = () => {
    navigate('/calendar?fromReschedule=true');
  };

  if (loading) {
    return (
      <div className="reschedule-container loading">
        <div className="loading-spinner"></div>
        <p>Loading appointment details...</p>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="reschedule-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={goBack} className="back-button">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reschedule-container success">
        <div className="success-icon">
          <FaCheck />
        </div>
        <h2>Appointment Rescheduled!</h2>
        <p>Your appointment has been successfully rescheduled.</p>
        <div className="success-details">
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <span>{selectedDate}</span>
          </div>
          <div className="detail-item">
            <FaClock className="detail-icon" />
            <span>{selectedTime}</span>
          </div>
        </div>
        <div className="button-group">
          <button onClick={goToCalendar} className="calendar-button">
            View Calendar
          </button>
          <button onClick={goToDashboard} className="dashboard-button">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reschedule-container">
      <div className="reschedule-header">
        <button onClick={goBack} className="back-button">
          <FaArrowLeft /> Back
        </button>
        <h1>Reschedule Appointment</h1>
      </div>
      
      <div className="current-appointment">
        <h3>Current Appointment</h3>
        <div className="current-details">
          <div className="detail-item">
            <strong>Service:</strong>
            <span>{appointment.serviceName}</span>
          </div>
          <div className="detail-item">
            <strong>Date:</strong>
            <span>{new Date(appointment.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="detail-item">
            <strong>Time:</strong>
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleReschedule} className="reschedule-form">
        <h3>New Appointment Time</h3>
        
        <div className="form-section">
          <h4>Select a New Date</h4>
          <div className="date-selector">
            {dateOptions.map((date) => (
              <button
                key={date}
                type="button"
                className={`date-button ${selectedDate === date ? "selected" : ""}`}
                onClick={() => setSelectedDate(date)}
              >
                {date}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h4>Select a New Time</h4>
          <div className="time-selector">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                className={`time-button ${selectedTime === time ? "selected" : ""}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="reschedule-button"
          disabled={!selectedDate || !selectedTime || submitting}
        >
          {submitting ? 'Rescheduling...' : 'Confirm Reschedule'}
        </button>
      </form>
    </div>
  );
};

export default RescheduleAppointment; 
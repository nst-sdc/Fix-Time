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
    
    // Get the current appointment date if available
    const appointmentDate = appointment ? new Date(appointment.date) : null;
    
    // Use today or appointment date (whichever is later) as the starting point
    const startDate = appointmentDate && appointmentDate > today ? appointmentDate : today;
    
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(startDate.getDate() + i);
      
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      
      options.push(formattedDate);
    }
    
    return options;
  };

  // Get date options based on the current appointment
  const dateOptions = appointment ? generateDateOptions() : [];
  
  // Generate time slots for the selected date
  const generateTimeSlots = (selectedDate) => {
    // Default time slots
    const allTimeSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];
    
    if (!appointment || !selectedDate) return allTimeSlots;
    
    // Parse the selected date
    const dateParts = selectedDate.split(' ');
    const month = new Date(Date.parse(dateParts[1] + " 1, 2000")).getMonth();
    const day = parseInt(dateParts[2]);
    const year = new Date().getFullYear();
    const selectedDateObj = new Date(year, month, day);
    
    // Current appointment date
    const appointmentDateObj = new Date(appointment.date);
    
    // If selected date is the same as the appointment date,
    // only show time slots after the current appointment time
    if (selectedDateObj.getDate() === appointmentDateObj.getDate() &&
        selectedDateObj.getMonth() === appointmentDateObj.getMonth() &&
        selectedDateObj.getFullYear() === appointmentDateObj.getFullYear()) {
      
      // Parse appointment time
      const [apptTime, apptPeriod] = appointment.time.split(' ');
      const [apptHours, apptMinutes] = apptTime.split(':');
      let apptHour = parseInt(apptHours);
      if (apptPeriod === 'PM' && apptHour !== 12) apptHour += 12;
      if (apptPeriod === 'AM' && apptHour === 12) apptHour = 0;
      
      // Filter time slots after appointment time
      return allTimeSlots.filter(slot => {
        const [time, period] = slot.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        // Return true if this time slot is after the appointment time
        return hour > apptHour || (hour === apptHour && parseInt(minutes) > parseInt(apptMinutes));
      });
    }
    
    return allTimeSlots;
  };
  
  // Get time slots based on the selected date
  const timeSlots = generateTimeSlots(selectedDate);

  useEffect(() => {
    // Fetch appointment details
    const fetchAppointment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const appointmentId = searchParams.get('id');
      
      if (!appointmentId) {
        setError('No appointment ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to view this appointment');
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
          const appt = response.data.appointments.find(a => a._id === appointmentId);
          
          if (!appt) {
            throw new Error('Appointment not found');
          }
          
          setAppointment(appt);
          
          // Set initial selected date and time
          const date = new Date(appt.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
          
          setSelectedDate(formattedDate);
          setSelectedTime(appt.time);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch appointment');
        }
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError('Failed to load appointment. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointment();
  }, [location.search]);

  // Update time slots when a date is selected
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Reset time selection
    setSelectedTime('');
  };

  // Use effect to update time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      // If the available time slots for the selected date don't include
      // the currently selected time, reset it
      const availableTimeSlots = generateTimeSlots(selectedDate);
      if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
        setSelectedTime('');
      }
    }
  }, [selectedDate]);

  const handleReschedule = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }
    
    // Check if the selected date and time are valid for rescheduling
    if (appointment) {
      const currentAppointmentDate = new Date(appointment.date);
      
      // Parse the selected date
      const dateParts = selectedDate.split(' ');
      const month = new Date(Date.parse(dateParts[1] + " 1, 2000")).getMonth();
      const day = parseInt(dateParts[2]);
      const year = new Date().getFullYear();
      const newDateObj = new Date(year, month, day);
      
      // Parse the selected time
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      // Set the time on the new date
      newDateObj.setHours(hour, parseInt(minutes), 0);
      
      // Check if the new date/time is after the current appointment
      if (newDateObj <= currentAppointmentDate) {
        setError('Please select a date and time after the current appointment');
        return;
      }
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to reschedule an appointment');
        setSubmitting(false);
        return;
      }
      
      // Parse the selected date into a date object
      const dateParts = selectedDate.split(' ');
      const month = new Date(Date.parse(dateParts[1] + " 1, 2000")).getMonth();
      const day = parseInt(dateParts[2]);
      const today = new Date();
      const newDate = new Date(today.getFullYear(), month, day);
      
      // Call API to reschedule appointment
      const response = await axios.put(
        `http://localhost:5001/appointments/${appointment._id}/reschedule`,
        {
          date: newDate.toISOString(),
          time: selectedTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Create updated appointment object
        const updatedAppointment = response.data.appointment;
        
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
      } else {
        throw new Error(response.data?.message || 'Failed to reschedule appointment');
      }
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
                onClick={() => handleDateSelect(date)}
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
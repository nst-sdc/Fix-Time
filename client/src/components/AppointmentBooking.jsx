import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import "./AppointmentBooking.css";
import ReviewForm from './ReviewForm';

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM",
  "10:30 AM", "11:30 AM", "1:00 PM",
  "2:00 PM", "2:30 PM", "3:30 PM",
  "4:30 PM", "5:30 PM"
];

const AppointmentBooking = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const serviceId = searchParams.get('serviceId');
  const serviceName = searchParams.get('serviceName');

  // Generate 10 upcoming dates starting from today
  const [dateOptions, setDateOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: ""
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [bookedAppointmentId, setBookedAppointmentId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pre-fill form with logged-in user's data
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      setFormData(prev => ({
        ...prev,
        name: loggedInUser.fullName || "",
        email: loggedInUser.email || ""
      }));
    }

    const generateDates = () => {
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const formattedDate = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
        dates.push(formattedDate);
      }
      
      setDateOptions(dates);
      setSelectedDate(dates[0]);
    };
    
    generateDates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and time for your appointment");
      return;
    }

    // Convert the friendly date string to a proper Date object for the backend
    const [dayName, monthStr, dayNum] = selectedDate.replace(',', '').split(' ');
    const year = new Date().getFullYear();
    const isoDate = new Date(`${monthStr} ${dayNum}, ${year}`).toISOString();
    
    const appointmentData = {
      serviceId, // Use the real serviceId from the URL
      date: isoDate,
      time: selectedTime,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      notes: formData.reason,
    };
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to book an appointment.");
        return;
      }

      const response = await axios.post(
        'http://localhost:5001/api/appointments/book',
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setBookedAppointmentId(response.data.data._id);
      setBookedSlots([...bookedSlots, { date: selectedDate, time: selectedTime }]);
      setShowReviewForm(true);
      
    } catch (err) {
      console.error('Error booking appointment:', err.response ? err.response.data : err.message);
      alert(`Failed to book appointment. ${err.response?.data?.message || 'Please try again.'}`);
    }
  };

  const isSlotDisabled = (date, time) => {
    const now = new Date();

    // Convert readable date like "Thu, Jun 26" to real date
    const [dayName, monthStr, dayNum] = date.replace(',', '').split(' ');
    const year = new Date().getFullYear(); 
    const fullDateStr = `${monthStr} ${dayNum}, ${year} ${time}`;
    const slotDateTime = new Date(fullDateStr);

    const isPast = slotDateTime < now;

    const isBooked = bookedSlots.some(
      (b) => b.date === date && b.time === time
    );

    return isPast || isBooked;
  };

  const handleReviewSubmitted = (review) => {
    // Show success message or update UI as needed
    console.log('Review submitted successfully:', review);
    
    // For demo purposes, just hide the review form after a delay
    setTimeout(() => {
      alert('Thank you for your review! Your feedback is valuable to us.');
      setShowReviewForm(false);
    }, 2000);
  };

  // If showing review form, render it instead of booking form
  if (showReviewForm) {
    return (
      <div className="booking-container">
        <h2>Thank You for Booking!</h2>
        <p className="booking-success-message">
          Your appointment for <strong>{serviceName}</strong> has been confirmed. We look forward to serving you!
        </p>
        <div className="review-form-wrapper">
          <ReviewForm 
            appointmentId={bookedAppointmentId} 
            onReviewSubmitted={() => setShowReviewForm(false)}
          />
        </div>
      </div>
    );
  }

  // Original booking form
  return (
    <div className="booking-container">
      <h2>Book Your Appointment!</h2>
      {serviceName && (
        <div className="selected-service">
          <span>Service: </span>
          <strong>{serviceName}</strong>
        </div>
      )}

      <div className="reminder-message" style={{marginBottom: '1rem', color: '#1976d2', fontWeight: 500}}>
        You'll receive timely reminders before your appointment.
      </div>

      <h4 className="section-heading">📅 Select a Date</h4>
      <div className="date-selector">
        {dateOptions.map((date) => (
          <button
            key={date}
            className={`date-button ${selectedDate === date ? "selected" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </div>

      <h4 className="section-heading">⏰ Select a Time Slot</h4>
      <div className="time-selector">
        {timeSlots.map((slot) => {
          const disabled = isSlotDisabled(selectedDate, slot);
          return (
            <button
              key={slot}
              className={`time-button ${selectedTime === slot ? "selected" : ""}`}
              onClick={() => !disabled && setSelectedTime(slot)}
              disabled={disabled}
              style={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "not-allowed" : "pointer"
              }}
            >
              {slot}
            </button>
          );
        })}
      </div>

      <form className="form-fields" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Full Name"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
            required
            readOnly={!!user?.email} // Make email read-only if logged in
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            value={formData.phone}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Notes or Reason for Visit (Optional):</label>
          <textarea
            id="reason"
            name="reason"
            placeholder="e.g., Color preference, specific issue"
            rows={3}
            onChange={handleChange}
            value={formData.reason}
          />
        </div>

        <button className="confirm-button" type="submit">
          Confirm Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;

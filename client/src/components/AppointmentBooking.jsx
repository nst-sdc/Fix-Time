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
  const preSelectedService = searchParams.get('service');

  // Generate 10 upcoming dates starting from today
  const [dateOptions, setDateOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: preSelectedService || ""
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [bookedAppointmentId, setBookedAppointmentId] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({...prev, reason: preSelectedService}));
    }
  }, [preSelectedService]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and time for your appointment");
      return;
    }
    
    const appointmentData = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      // In a real app, these would come from the database:
      serviceId: "mock-service-id", 
      userId: "mock-user-id"
    };
    
    // In a real app, you would send this to the backend API
    // try {
    //   const token = localStorage.getItem('token');
    //   const response = await axios.post(
    //     'http://localhost:5001/appointments/book',
    //     appointmentData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     }
    //   );
    //   
    //   setBookedAppointmentId(response.data.appointment._id);
    //   setBookedSlots([...bookedSlots, { date: selectedDate, time: selectedTime }]);
    //   
    //   // For demo purposes, let's immediately mark the appointment as completed
    //   // In a real app, this would happen when the actual appointment is completed
    //   const mockCompleteResponse = await axios.patch(
    //     `http://localhost:5001/appointments/${response.data.appointment._id}/complete`,
    //     {},
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     }
    //   );
    //   
    //   setShowReviewForm(true);
    //   
    // } catch (err) {
    //   console.error('Error booking appointment:', err);
    //   alert('Failed to book appointment. Please try again.');
    // }

    // For demo purposes, let's just simulate a successful booking
    setBookedSlots([...bookedSlots, { date: selectedDate, time: selectedTime }]);
    setBookedAppointmentId("mock-appointment-id-" + Date.now());
    setShowReviewForm(true);
    
    alert(
      `✅ Appointment booked on ${selectedDate} at ${selectedTime}\n👤 Name: ${formData.name}`
    );
    
    // Reset form
    setSelectedTime("");
    setFormData({ name: "", email: "", phone: "", reason: preSelectedService || "" });
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
          Your appointment has been confirmed. We look forward to serving you!
        </p>
        <div className="review-form-wrapper">
          <ReviewForm 
            appointmentId={bookedAppointmentId} 
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      </div>
    );
  }

  // Original booking form
  return (
    <div className="booking-container">
      <h2>Book Your Appointment!</h2>
      {preSelectedService && (
        <div className="selected-service">
          <span>Service: </span>
          <strong>{preSelectedService}</strong>
        </div>
      )}

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
          <label htmlFor="reason">Enter your reason for Visit:</label>
          <textarea
            id="reason"
            name="reason"
            placeholder="Reason for Visit"
            rows={3}
            onChange={handleChange}
            value={formData.reason}
            required
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

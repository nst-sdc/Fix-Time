import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./AppointmentBooking.css";
import ReviewForm from './ReviewForm';

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM",
  "10:30 AM", "11:30 AM", "1:00 PM",
  "2:00 PM", "2:30 PM", "3:30 PM",
  "4:30 PM", "5:30 PM"
];

const AppointmentBooking = ({ serviceId = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const preSelectedService = searchParams.get('service');
  const preSelectedServiceId = searchParams.get('serviceId');

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
  const [loading, setLoading] = useState(false);

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

  // Add phone validation function at the top of the component
  const validatePhone = (phone) => {
    // Basic validation: At least 10 digits
    return /^\d{10,15}$/.test(phone.replace(/\D/g, ''));
  };

  // Update handleSubmit function to validate phone before submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and time for your appointment");
      return;
    }

    // Validate phone number
    const phoneToUse = formData.phone.trim();
    if (!validatePhone(phoneToUse)) {
      alert("Please enter a valid phone number (at least 10 digits)");
      return;
    }
    
    // Parse selected date into a proper Date object
    const [dayName, monthStr, dayNum] = selectedDate.replace(',', '').split(' ');
    const year = new Date().getFullYear();
    const months = {"Jan":0,"Feb":1,"Mar":2,"Apr":3,"May":4,"Jun":5,"Jul":6,"Aug":7,"Sep":8,"Oct":9,"Nov":10,"Dec":11};
    
    const appointmentDate = new Date(year, months[monthStr], parseInt(dayNum));
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("You must be logged in to book an appointment");
        navigate('/login');
        return;
      }
      
      // Get user profile to use for customer details
      const userResponse = await axios.get('http://localhost:5001/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("User profile response:", userResponse.data);
      
      if (!userResponse.data || !userResponse.data.success || !userResponse.data.user) {
        console.error("Invalid user profile response:", userResponse.data);
        throw new Error("Could not fetch user profile");
      }
      
      const user = userResponse.data.user;
      const effectiveServiceId = preSelectedServiceId || serviceId;
      
      console.log("Booking appointment with serviceId:", effectiveServiceId);
      
      // If no serviceId is provided, let's fetch the first available service of the requested name
      let finalServiceId = effectiveServiceId;
      
      if (!finalServiceId && preSelectedService) {
        // Try to find a service with the matching name
        try {
          const servicesResponse = await axios.get('http://localhost:5001/services', {
            params: { name: preSelectedService }
          });
          
          if (servicesResponse.data && servicesResponse.data.services && servicesResponse.data.services.length > 0) {
            finalServiceId = servicesResponse.data.services[0]._id;
            console.log("Found service by name:", finalServiceId);
          }
        } catch (err) {
          console.error("Error finding service by name:", err);
        }
      }
      
      if (!finalServiceId) {
        // If we still don't have a serviceId, get the first service from any category
        try {
          const servicesResponse = await axios.get('http://localhost:5001/services');
          
          if (servicesResponse.data && servicesResponse.data.services && servicesResponse.data.services.length > 0) {
            finalServiceId = servicesResponse.data.services[0]._id;
            console.log("Using first available service:", finalServiceId);
          }
        } catch (err) {
          console.error("Error getting any services:", err);
        }
      }
      
      if (!finalServiceId) {
        throw new Error("No service ID available for booking");
      }
      
      // Use the correct user fields from the profile response
      const appointmentData = {
        serviceId: finalServiceId,
        date: appointmentDate.toISOString(),
        time: selectedTime,
        notes: formData.reason,
        customerName: formData.name || user.name,
        customerEmail: formData.email || user.email,
        customerPhone: phoneToUse
      };
      
      console.log("Appointment data being sent:", appointmentData);
      
      // Create the appointment
      const response = await axios.post(
        'http://localhost:5001/appointments',
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        setBookedAppointmentId(response.data.appointment._id);
        setBookedSlots([...bookedSlots, { date: selectedDate, time: selectedTime }]);
        
        alert(`✅ Appointment booked successfully on ${selectedDate} at ${selectedTime}`);
        
        // Navigate to calendar view to see the appointment
        navigate('/calendar');
      } else {
        throw new Error(response.data?.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      alert(`Failed to book appointment: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
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

        <button className="confirm-button" type="submit" disabled={loading}>
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;

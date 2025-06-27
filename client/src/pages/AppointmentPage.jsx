import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaMapPin, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import './AppointmentPage.css';

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const services = [
    { id: 'general', name: 'General Consultation', duration: '30 min', price: '$50' },
    { id: 'emergency', name: 'Emergency Service', duration: '45 min', price: '$75' },
    { id: 'followup', name: 'Follow-up Visit', duration: '20 min', price: '$35' },
    { id: 'specialist', name: 'Specialist Consultation', duration: '60 min', price: '$100' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for future booking functionality
    alert('Booking functionality coming soon! This is a placeholder.');
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        {/* Header */}
        <div className="appointment-header">
          <button className="back-button" onClick={handleBackToDashboard}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="appointment-title">Book Your Appointment</h1>
          <p className="appointment-subtitle">Schedule your visit with our professional team</p>
        </div>

        {/* Coming Soon Notice */}
        <div className="coming-soon-notice">
          <FaInfoCircle className="notice-icon" />
          <div className="notice-content">
            <h3>Booking System Coming Soon!</h3>
            <p>We're currently developing our advanced booking system. For now, you can explore the interface and see what features will be available.</p>
          </div>
        </div>

        <div className="appointment-content">
          {/* Service Selection */}
          <div className="appointment-section">
            <h2 className="section-title">
              <FaCalendarAlt className="section-icon" />
              Select Service
            </h2>
            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <h3>{service.name}</h3>
                  <div className="service-details">
                    <span className="duration">{service.duration}</span>
                    <span className="price">{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="appointment-section">
            <h2 className="section-title">
              <FaClock className="section-icon" />
              Select Date & Time
            </h2>
            <div className="datetime-selection">
              <div className="date-selection">
                <label>Preferred Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  className="date-input"
                />
              </div>
              
              <div className="time-selection">
                <label>Preferred Time:</label>
                <div className="time-slots">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="appointment-section">
            <h2 className="section-title">
              <FaUser className="section-icon" />
              Additional Information
            </h2>
            <div className="notes-section">
              <label>Special Notes or Requirements:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Please mention any specific concerns, symptoms, or special requirements..."
                className="notes-textarea"
                rows="4"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="appointment-section">
            <h2 className="section-title">
              <FaPhone className="section-icon" />
              Contact Information
            </h2>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </div>
              </div>
              <div className="contact-item">
                <FaMapPin className="contact-icon" />
                <div>
                  <strong>Address:</strong> 123 Medical Center Dr, Suite 100
                </div>
              </div>
              <div className="contact-item">
                <FaClock className="contact-icon" />
                <div>
                  <strong>Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button
              type="button"
              className="book-appointment-btn"
              onClick={handleSubmit}
              disabled={!selectedService || !selectedDate || !selectedTime}
            >
              Book Appointment
            </button>
            <p className="submit-note">
              * This is a demo interface. Actual booking functionality will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;

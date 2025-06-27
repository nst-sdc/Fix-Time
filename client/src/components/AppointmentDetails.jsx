import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaStar } from 'react-icons/fa';
import ReviewForm from './ReviewForm';
import './AppointmentDetails.css';

const AppointmentDetails = ({ appointment }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(appointment?.hasReviewed || false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleReviewSubmit = (review) => {
    console.log('Review submitted successfully:', review);
    setHasReviewed(true);
    setShowReviewForm(false);
    setTimeout(() => {
      alert('Thank you for your review!');
    }, 500);
  };
  
  return (
    <div className="appointment-details">
      <div className="appointment-card">
        <div className="appointment-header">
          <h3>{appointment.serviceName}</h3>
          <span className={`status-badge status-${appointment.status}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
        
        <div className="appointment-info">
          <div className="info-item">
            <FaCalendarAlt className="info-icon" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="info-item">
            <FaClock className="info-icon" />
            <span>{appointment.time}</span>
          </div>
        </div>
        
        {appointment.status === 'completed' && !hasReviewed && !showReviewForm && (
          <button 
            className="leave-review-btn" 
            onClick={() => setShowReviewForm(true)}
          >
            <FaStar className="review-icon" />
            Leave a Review
          </button>
        )}
        
        {(appointment.status === 'completed' && hasReviewed) && (
          <div className="reviewed-badge">
            <FaCheckCircle className="check-icon" />
            Reviewed
          </div>
        )}
      </div>
      
      {showReviewForm && (
        <div className="review-section">
          <ReviewForm 
            appointmentId={appointment._id} 
            onReviewSubmitted={handleReviewSubmit} 
          />
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails; 
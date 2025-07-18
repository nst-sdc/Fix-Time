import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaStar } from 'react-icons/fa';
import ReviewForm from './ReviewForm';
import './AppointmentDetails.css';
import { useNavigate } from 'react-router-dom';

const AppointmentDetails = ({ appointment }) => {
  const [hasReviewed, setHasReviewed] = useState(appointment?.hasReviewed || false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ✅ Compute actual status based on current date and time
  const computeStatus = () => {
    const now = new Date();

    const [apptTime, meridian] = appointment.time.split(' ');
    let [hours, minutes] = apptTime.split(':').map(Number);
    if (meridian === 'PM' && hours !== 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    const apptDateTime = new Date(appointment.date);
    apptDateTime.setHours(hours);
    apptDateTime.setMinutes(minutes);
    apptDateTime.setSeconds(0);

    return apptDateTime < now ? 'completed' : appointment.status;
  };

  const status = computeStatus();

  const handleReviewSubmit = (review) => {
    console.log('Review submitted successfully:', review);
    setHasReviewed(true);
    setTimeout(() => {
      alert('Thank you for your review!');
    }, 500);
  };

  return (
    <div className="appointment-details">
      <div className="appointment-card">
        <div className="appointment-header">
          <h3>{appointment.serviceName}</h3>
          {appointment.customerName || appointment.customerEmail ? (
            <div className="appointment-customer">
              {appointment.customerName || appointment.customerEmail}
            </div>
          ) : null}
          <span className={`status-badge status-${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
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

        {status === 'completed' && !hasReviewed && (
          <button 
            className="leave-review-btn" 
            onClick={() => navigate('/leave-review', { state: { appointmentId: appointment._id } })}
          >
            <FaStar className="review-icon" />
            Leave a Review
          </button>
        )}

        {status === 'completed' && hasReviewed && (
          <div className="reviewed-badge">
            <FaCheckCircle className="check-icon" />
            Reviewed
          </div>
        )}
      </div>

      {/* Remove all showReviewForm logic and modal rendering */}
    </div>
  );
};

export default AppointmentDetails;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import './LeaveReviewPage.css';

const LeaveReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = location.state?.appointmentId;

  const handleReviewSubmitted = () => {
    setTimeout(() => {
      alert('Thank you for your review!');
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="leave-review-page-container">
      <div className="leave-review-form-wrapper">
        <h2>Leave a Review</h2>
        <ReviewForm appointmentId={appointmentId} onReviewSubmitted={handleReviewSubmitted} />
      </div>
    </div>
  );
};

export default LeaveReviewPage; 
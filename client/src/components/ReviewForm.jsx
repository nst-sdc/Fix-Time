import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './ReviewForm.css';

// ReviewForm component for handling user reviews in both demo and production modes
const ReviewForm = ({ appointmentId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 5) {
      setError('Please enter a comment (minimum 5 characters)');
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Create a mock review object
      const review = {
        id: `review-${Date.now()}`,
        appointmentId,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      
      // Update state
      setLoading(false);
      setSubmitted(true);
      
      // Notify parent component
      if (onReviewSubmitted && typeof onReviewSubmitted === 'function') {
        onReviewSubmitted(review);
      }
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="review-form-container thank-you">
        <h3>Thank You for Your Review!</h3>
        <p>Your feedback helps us improve our services.</p>
        <div className="submitted-rating">
          {[...Array(5)].map((_, index) => (
            <FaStar 
              key={index} 
              className={index < rating ? "star-filled" : "star-empty"} 
              size={35} 
            />
          ))}
        </div>
        <p className="submitted-comment">"{comment}"</p>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3>How would you rate your experience?</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            
            return (
              <FaStar 
                key={ratingValue} 
                className={ratingValue <= (hover || rating) ? "star-filled" : "star-empty"}
                size={35}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>
        
        <div className="form-group">
          <label htmlFor="review-comment">Your Comment:</label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            required
            minLength={5}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="submit-review-btn" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm; 
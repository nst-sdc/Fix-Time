import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './ReviewForm.css';

const ReviewForm = ({ appointmentId, onReviewSubmitted, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 5) {
      setError('Please enter a comment (min 5 characters)');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const review = {
        id: `review-${Date.now()}`,
        appointmentId,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };

      setLoading(false);
      setSubmitted(true);

      if (onReviewSubmitted) {
        onReviewSubmitted(review);
      }
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="review-modal-overlay">
        <div className="review-form-container">
          <button className="close-btn" onClick={onClose}>×</button>
          <h3>Thank you for your review!</h3>
          <p>“{comment}”</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-modal-overlay">
      <div className="review-form-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>How would you rate your experience?</h3>

        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <FaStar
                  key={starValue}
                  size={32}
                  className={starValue <= (hover || rating) ? 'star-filled' : 'star-empty'}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                />
              );
            })}
          </div>

          <div className="form-group">
            <label>Your Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-review-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;


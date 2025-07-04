import React, { useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import './ReviewForm.css';

const ReviewForm = ({ appointmentId = 'demo123', onReviewSubmitted = () => {}, onClose = () => {} }) => {
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
      setError('Please enter a comment (minimum 5 characters)');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const review = {
        id: `review-${Date.now()}`,
        appointmentId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      setLoading(false);
      setSubmitted(true);
      onReviewSubmitted(review);
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {/* FORM OR THANK YOU MESSAGE */}
        {!submitted ? (
          <div className="review-form-container">
            <h3>How would you rate your experience?</h3>

            <form onSubmit={handleSubmit}>
              <div className="star-rating">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <FaStar
                      key={ratingValue}
                      className={ratingValue <= (hover || rating) ? 'star-filled' : 'star-empty'}
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
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button className="submit-review-btn" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className="review-form-container thank-you">
            <h3>Thank You for Your Review!</h3>
            <p>Your feedback helps us improve our services.</p>
            <div className="submitted-rating">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < rating ? 'star-filled' : 'star-empty'}
                  size={35}
                />
              ))}
            </div>
            <p className="submitted-comment">"{comment}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;



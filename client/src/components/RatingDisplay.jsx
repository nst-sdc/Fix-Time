import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { BsStar } from 'react-icons/bs';
import './RatingDisplay.css';

const RatingDisplay = ({ rating, totalReviews }) => {
  // Round rating to nearest half
  const roundedRating = Math.round(rating * 2) / 2;
  
  // Create star elements
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      // Full star
      stars.push(<FaStar key={i} className="star-filled" />);
    } else if (i - 0.5 === roundedRating) {
      // Half star
      stars.push(<FaStarHalfAlt key={i} className="star-filled" />);
    } else {
      // Empty star
      stars.push(<BsStar key={i} className="star-empty" />);
    }
  }

  return (
    <div className="rating-display">
      <div className="stars">{stars}</div>
      <span className="rating-text">
        {rating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})
      </span>
    </div>
  );
};

export default RatingDisplay; 
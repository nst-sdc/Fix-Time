import React from 'react';
import { Link } from 'react-router-dom';
import RatingDisplay from './RatingDisplay';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const { _id, name, icon, avgRating, totalReviews, price, duration } = service;

  return (
    <Link to={`/book?service=${encodeURIComponent(name)}${_id ? `&serviceId=${_id}` : ''}`} className="service-link">
      <div className="service-card">
        <div className="service-icon">{icon}</div>
        <div className="service-details">
          <p className="service-name">{name}</p>

          {avgRating !== undefined && totalReviews > 0 ? (
            <RatingDisplay 
              rating={parseFloat(avgRating)} 
              totalReviews={totalReviews} 
            />
          ) : (
            <p className="no-reviews">⭐ No reviews yet</p>
          )}

          {price && <p className="service-price">Price: ₹{price}</p>}
          {duration && <p className="service-duration">Duration: {duration} min</p>}

          <button className="book-now-btn">Book Now</button>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;

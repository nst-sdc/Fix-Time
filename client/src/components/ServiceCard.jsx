import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RatingDisplay from './RatingDisplay';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const { _id, name, icon, avgRating, totalReviews, price, duration, description, provider, location, contact, imageUrl } = service;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Link to={`/book?service=${encodeURIComponent(name)}${_id ? `&serviceId=${_id}` : ''}`} className="service-link">
        <div className="service-card">
          <div className="service-icon">{icon}</div>
          <div className="service-details">
            <p className="service-name">{name}</p>
            {avgRating !== undefined && (
              <RatingDisplay 
                rating={parseFloat(avgRating)} 
                totalReviews={totalReviews} 
              />
            )}
            {price && <p className="service-price">${price}</p>}
            {duration && <p className="service-duration">{duration} min</p>}
            <button className="book-now-btn">Book Now</button>
            <button className="know-more-btn" type="button" onClick={e => { e.preventDefault(); setShowModal(true); }}>Know More</button>
          </div>
        </div>
      </Link>
      {showModal && (
        <div className="service-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="service-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h2>{name}</h2>
            {imageUrl && <img src={imageUrl} alt={name} className="service-modal-img" />}
            <p><strong>Description:</strong> {description || 'No description available.'}</p>
            {provider && <p><strong>Provider:</strong> {provider}</p>}
            {location && <p><strong>Location:</strong> {location}</p>}
            {contact && <p><strong>Contact:</strong> {contact}</p>}
            {price && <p><strong>Price:</strong> ${price}</p>}
            {duration && <p><strong>Duration:</strong> {duration} min</p>}
            {avgRating !== undefined && <RatingDisplay rating={parseFloat(avgRating)} totalReviews={totalReviews} />}
            <button className="book-now-btn" onClick={() => { setShowModal(false); window.location.href = `/book?service=${encodeURIComponent(name)}${_id ? `&serviceId=${_id}` : ''}`; }}>Book Now</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard; 
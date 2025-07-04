import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RatingDisplay from './RatingDisplay';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const { _id, name, icon, avgRating, totalReviews, price, duration, description, provider, location, contact, timeSlots } = service;
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);

  // Split location into address and city if possible
  let address = '', city = '';
  if (location) {
    const parts = location.split(',');
    address = parts.slice(0, -1).join(',').trim();
    city = parts.slice(-1)[0]?.trim() || '';
  }

  useEffect(() => {
    if (!panelOpen) return;
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setPanelOpen(false);
      }
    }
    function handleEsc(event) {
      if (event.key === 'Escape') setPanelOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [panelOpen]);

  return (
    <div className="service-card-wrapper" style={{width: '100%'}}>
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
          {price && <p className="service-price">₹{price}</p>}
          {duration && <p className="service-duration">{duration} min</p>}
          <div className="service-actions-row">
            <Link
              to={`/book?service=${encodeURIComponent(name)}${_id ? `&serviceId=${_id}` : ''}`}
              className="book-now-btn"
              style={{ textDecoration: 'none' }}
            >
              Book Now
            </Link>
            <button className="know-more-btn" onClick={() => setPanelOpen(true)}>
              Know More
            </button>
          </div>
        </div>
      </div>
      {panelOpen && (
        <>
          <div className="sidepanel-overlay" />
          <div className="service-sidepanel" ref={panelRef}>
            <button className="close-sidepanel-btn" onClick={() => setPanelOpen(false)}>&times;</button>
            <div className="sidepanel-header">
              <h2>{name}</h2>
            </div>
            <div className="sidepanel-body">
              {provider && <div className="sidepanel-detail"><strong>Company Name:</strong> {provider}</div>}
              {description && <div className="sidepanel-detail"><strong>Description:</strong> {description}</div>}
              {price && <div className="sidepanel-detail"><strong>Price:</strong> ₹{price}</div>}
              {duration && <div className="sidepanel-detail"><strong>Duration:</strong> {duration} min</div>}
              {address && <div className="sidepanel-detail"><strong>Address:</strong> {address}</div>}
              {city && <div className="sidepanel-detail"><strong>City:</strong> {city}</div>}
              {contact && <div className="sidepanel-detail"><strong>Contact:</strong> {contact}</div>}
              {timeSlots && timeSlots.length > 0 && <div className="sidepanel-detail"><strong>Availability:</strong> {timeSlots.join(', ')}</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceCard; 
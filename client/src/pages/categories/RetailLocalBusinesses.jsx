import React from 'react';
import './CategoryPage.css';
import { FaTshirt, FaGem, FaStore, FaDog, FaGift, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const services = [
  { name: "Tailor Appointments (custom fitting)", icon: <FaTshirt /> },
  { name: "Jeweller Consultation (custom design)", icon: <FaGem /> },
  { name: "Boutique Trials / Booking", icon: <FaStore /> },
  { name: "Pet Grooming Services", icon: <FaDog /> },
  { name: "Custom Gift Makers or Artists", icon: <FaGift /> },
  { name: "Local Laundry / Dry Cleaning Pickup-Slots", icon: <FaShoppingBag /> }
];

const RetailLocalBusinesses = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">🛍️ Retail & Local Businesses</h1>
      <div className="services-list">
        {services.map((service, idx) => (
          <Link to={`/book?service=${encodeURIComponent(service.name)}`} className="service-link" key={idx}>
            <div className="service-card">
              <div className="service-icon">{service.icon}</div>
              <div className="service-details">
                <p className="service-name">{service.name}</p>
                <button className="book-now-btn">Book Now</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RetailLocalBusinesses; 
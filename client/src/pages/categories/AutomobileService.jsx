import React from 'react';
import './CategoryPage.css';
import { FaCar, FaWind, FaUserCog, FaOilCan, FaShower } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const services = [
  { name: "Car/Bike Servicing", icon: <FaCar /> },
  { name: "Pollution Check Booking", icon: <FaWind /> },
  { name: "RTO Agent Consultations", icon: <FaUserCog /> },
  { name: "Tire & Oil Change", icon: <FaOilCan /> },
  { name: "Vehicle Cleaning / Detailing Services", icon: <FaShower /> }
];

const AutomobileService = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">🚗 Automobile Services</h1>
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

export default AutomobileService; 
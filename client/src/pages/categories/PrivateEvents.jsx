import React from 'react';
import './CategoryPage.css';
import { FaCalendarAlt, FaChalkboardTeacher, FaBirthdayCake, FaRing, FaBuilding, FaGlassCheers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const services = [
  { name: "Webinar Booking", icon: <FaChalkboardTeacher /> },
  { name: "Seminar Registration", icon: <FaCalendarAlt /> },
  { name: "Birthday Party Reservation", icon: <FaBirthdayCake /> },
  { name: "Wedding Venue Booking", icon: <FaRing /> },
  { name: "Corporate Event Planning", icon: <FaBuilding /> },
  { name: "Anniversary Celebration Booking", icon: <FaGlassCheers /> }
];

const PrivateEvents = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">🎉 Private Events</h1>
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

export default PrivateEvents; 
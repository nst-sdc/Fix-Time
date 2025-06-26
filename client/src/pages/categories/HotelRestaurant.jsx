import React from 'react';
import './CategoryPage.css';
import { FaUtensils, FaBed, FaConciergeBell, FaGlassWhiskey, FaUsers, FaHotel } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const services = [
  { name: "Table Reservation", icon: <FaUtensils /> },
  { name: "Room Booking", icon: <FaBed /> },
  { name: "Buffet Slot Reservation", icon: <FaConciergeBell /> },
  { name: "Private Dining Booking", icon: <FaGlassWhiskey /> },
  { name: "Conference Room Reservation", icon: <FaUsers /> },
  { name: "Special Event Catering", icon: <FaHotel /> }
];

const HotelRestaurant = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">🏨 Hotel & Restaurant</h1>
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

export default HotelRestaurant; 
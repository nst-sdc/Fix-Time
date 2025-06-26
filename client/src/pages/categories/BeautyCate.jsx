import React from 'react';
import './CategoryPage.css';
import { FaCut, FaMale, FaPaintBrush, FaHands, FaSmile, FaRing, FaSpa, FaHotjar } from 'react-icons/fa';

const services = [
  { name: "Haircut & Styling", icon: <FaCut /> },
  { name: "Beard Grooming", icon: <FaMale /> },
  { name: "Hair Coloring / Smoothening", icon: <FaPaintBrush /> },
  { name: "Manicure & Pedicure", icon: <FaHands /> },
  { name: "Facial & Skin Treatment", icon: <FaSmile /> },
  { name: "Bridal/Party Makeup Sessions", icon: <FaRing /> },
  { name: "Spa & Massage Appointments", icon: <FaSpa /> },
  { name: "Waxing / Threading Services", icon: <FaHotjar /> }
];

const BeautyCate = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">💇 Beauty & Personal Care</h1>
      <div className="services-list">
        {services.map((service, idx) => (
          <div className="service-card" key={idx}>
            <div className="service-icon">{service.icon}</div>
            <div className="service-details">
              <p className="service-name">{service.name}</p>
              <button className="book-now-btn">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeautyCate; 
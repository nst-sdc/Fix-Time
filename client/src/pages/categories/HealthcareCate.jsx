import React from 'react';
import './CategoryPage.css';
import { FaUserMd, FaTooth, FaEye, FaWalking, FaVial, FaSyringe, FaCommentMedical, FaAppleAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const services = [
  { name: "General Physician Appointments", icon: <FaUserMd /> },
  { name: "Dentist Checkups", icon: <FaTooth /> },
  { name: "Eye Specialist Consultations", icon: <FaEye /> },
  { name: "Physiotherapy Sessions", icon: <FaWalking /> },
  { name: "Lab Test Bookings", icon: <FaVial /> },
  { name: "Vaccination Slots", icon: <FaSyringe /> },
  { name: "Mental Health Counselling", icon: <FaCommentMedical /> },
  { name: "Nutritionist Consultations", icon: <FaAppleAlt /> }
];

const HealthcareCate = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">🏥 Healthcare & Wellness</h1>
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

export default HealthcareCate; 
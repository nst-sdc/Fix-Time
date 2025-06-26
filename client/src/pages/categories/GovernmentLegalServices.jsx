import React from 'react';
import './CategoryPage.css';
import { FaIdCard, FaPassport, FaUserCheck, FaGavel, FaFileContract } from 'react-icons/fa';

const services = [
  { name: "Driving License Appointment", icon: <FaIdCard /> },
  { name: "Passport Verification Slot Booking", icon: <FaPassport /> },
  { name: "Aadhar Update Booking", icon: <FaUserCheck /> },
  { name: "Legal Consultation (Advocate visit)", icon: <FaGavel /> },
  { name: "Property Registration / Stamp Duty Token", icon: <FaFileContract /> }
];

const GovernmentLegalServices = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">📋 Government / Legal Services</h1>
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

export default GovernmentLegalServices; 
import React from 'react';
import './CategoryPage.css';
import { FaStethoscope, FaTooth, FaEye, FaRunning, FaFlask, FaSyringe, FaBrain, FaAppleAlt } from 'react-icons/fa';

const services = [
  { name: "General Physician Appointments", icon: <FaStethoscope /> },
  { name: "Dentist Checkups", icon: <FaTooth /> },
  { name: "Eye Specialist Consultations", icon: <FaEye /> },
  { name: "Physiotherapy Sessions", icon: <FaRunning /> },
  { name: "Lab Test Bookings (blood test, X-rays)", icon: <FaFlask /> },
  { name: "Vaccination Slots (especially flu, COVID)", icon: <FaSyringe /> },
  { name: "Mental Health Counselling", icon: <FaBrain /> },
  { name: "Dietician/Nutritionist Consultations", icon: <FaAppleAlt /> }
];

const HealthcareCate = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">🏥 Healthcare & Wellness</h1>
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

export default HealthcareCate; 
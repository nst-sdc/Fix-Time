import React from 'react';
import './CategoryPage.css';
import { FaBolt, FaWrench, FaSnowflake, FaWater, FaHammer, FaBug, FaCogs } from 'react-icons/fa';

const services = [
  { name: "Electrician Booking", icon: <FaBolt /> },
  { name: "Plumber Booking", icon: <FaWrench /> },
  { name: "AC Repair & Servicing", icon: <FaSnowflake /> },
  { name: "Water Purifier Maintenance", icon: <FaWater /> },
  { name: "Carpenter Appointments", icon: <FaHammer /> },
  { name: "Pest Control Scheduling", icon: <FaBug /> },
  { name: "Appliance Repairs (washing machine, fridge, etc.)", icon: <FaCogs /> }
];

const HomeRepairServices = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">🧰 Home & Repair Services</h1>
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

export default HomeRepairServices; 
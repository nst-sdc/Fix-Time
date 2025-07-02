import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaBolt, FaWrench, FaSnowflake, FaWater, FaHammer, FaBug, FaCogs } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  { name: "Electrician Booking", icon: <FaBolt /> },
  { name: "Plumber Booking", icon: <FaWrench /> },
  { name: "AC Repair & Servicing", icon: <FaSnowflake /> },
  { name: "Water Purifier Maintenance", icon: <FaWater /> },
  { name: "Carpenter Appointments", icon: <FaHammer /> },
  { name: "Pest Control Scheduling", icon: <FaBug /> },
  { name: "Appliance Repairs (washing machine, fridge, etc.)", icon: <FaCogs /> }
];

const HomeRepairServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to fetch services with ratings
    // For demo purposes, we're adding mock ratings to our static data
    setLoading(true);
    const servicesWithRatings = addRatingsToServices(serviceData);
    setServices(servicesWithRatings);
    setLoading(false);
  }, []);

  return (
    <CategoryPage categoryName="Home & Repair Services">
    <div className="category-page">
      <h1 className="category-title">🧰 Home & Repair Services</h1>
      {loading ? (
        <div className="loading-state">Loading services...</div>
      ) : (
      <div className="services-list">
        {services.map((service, idx) => (
            <ServiceCard key={idx} service={service} />
        ))}
      </div>
      )}
    </div>
    </CategoryPage>
  );
};

export default HomeRepairServices; 
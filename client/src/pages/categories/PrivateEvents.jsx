import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaCalendarAlt, FaChalkboardTeacher, FaBirthdayCake, FaRing, FaBuilding, FaGlassCheers } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';

const serviceData = [
  { name: "Webinar Booking", icon: <FaChalkboardTeacher /> },
  { name: "Seminar Registration", icon: <FaCalendarAlt /> },
  { name: "Birthday Party Reservation", icon: <FaBirthdayCake /> },
  { name: "Wedding Venue Booking", icon: <FaRing /> },
  { name: "Corporate Event Planning", icon: <FaBuilding /> },
  { name: "Anniversary Celebration Booking", icon: <FaGlassCheers /> }
];

const PrivateEvents = () => {
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
    <div className="category-page">
      <h1 className="category-title">🎉 Private Events</h1>
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
  );
};

export default PrivateEvents; 
import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaUtensils, FaBed, FaConciergeBell, FaGlassWhiskey, FaUsers, FaHotel } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  { name: "Table Reservation", icon: <FaUtensils /> },
  { name: "Room Booking", icon: <FaBed /> },
  { name: "Buffet Slot Reservation", icon: <FaConciergeBell /> },
  { name: "Private Dining Booking", icon: <FaGlassWhiskey /> },
  { name: "Conference Room Reservation", icon: <FaUsers /> },
  { name: "Special Event Catering", icon: <FaHotel /> }
];

const HotelRestaurant = () => {
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
    <CategoryPage categoryName="Hotel & Restaurant">
    <div className="category-page">
      <h1 className="category-title">🏨 Hotel & Restaurant</h1>
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

export default HotelRestaurant; 
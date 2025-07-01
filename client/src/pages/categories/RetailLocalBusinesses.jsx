import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaTshirt, FaGem, FaStore, FaDog, FaGift, FaShoppingBag } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  { name: "Tailor Appointments (custom fitting)", icon: <FaTshirt /> },
  { name: "Jeweller Consultation (custom design)", icon: <FaGem /> },
  { name: "Boutique Trials / Booking", icon: <FaStore /> },
  { name: "Pet Grooming Services", icon: <FaDog /> },
  { name: "Custom Gift Makers or Artists", icon: <FaGift /> },
  { name: "Local Laundry / Dry Cleaning Pickup-Slots", icon: <FaShoppingBag /> }
];

const RetailLocalBusinesses = () => {
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
    <CategoryPage categoryName="Private Events">
    <div className="category-page">
      <h1 className="category-title">🛍️ Retail & Local Businesses</h1>
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

export default RetailLocalBusinesses; 
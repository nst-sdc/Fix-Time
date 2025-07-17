import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryPage.css';
import ServiceCard from '../../components/ServiceCard';
import CategoryPage from './CategoryPage';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://fixtime-i368.onrender.com";

// List of pre-existing categories (should match those in SERVICES)
const PRE_EXISTING_CATEGORIES = [
  "🏥 Healthcare & Wellness",
  "💇 Beauty & Personal Care",
  "🧰 Home & Repair Services",
  "🧑‍🏫 Education & Coaching",
  "📋 Government / Legal Services",
  "🚗 Automobile Services",
  "🛍️ Retail & Local Businesses",
  "🎉 Private Events",
  "🏨 Hotel & Restaurant"
];

const OtherServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/services`);
        // Only include services whose category is not in the pre-existing list
        const others = response.data.services.filter(
          service => !PRE_EXISTING_CATEGORIES.includes(service.category)
        );
        setServices(others);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [refreshTrigger]);

  const handleServiceAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <CategoryPage categoryName="Others" onServiceAdded={handleServiceAdded}>
      <div className="category-page">
        <h1 className="category-title">🗂️ Others</h1>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading-state">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="no-services-message">No services available in this category yet.</div>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <ServiceCard key={service._id || service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </CategoryPage>
  );
};

export default OtherServices; 
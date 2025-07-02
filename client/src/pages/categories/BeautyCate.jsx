import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryPage.css';
import { FaCut, FaMale, FaPaintBrush, FaHands, FaSmile, FaRing, FaSpa, FaHotjar, FaSync } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import CategoryPage from './CategoryPage';
// Icon mapping for services
const serviceIcons = {
  "Haircut & Styling": <FaCut />,
  "Beard Grooming": <FaMale />,
  "Hair Coloring / Smoothening": <FaPaintBrush />,
  "Manicure & Pedicure": <FaHands />,
  "Facial & Skin Treatment": <FaSmile />,
  "Bridal/Party Makeup Sessions": <FaRing />,
  "Spa & Massage": <FaSpa />,
  "Waxing / Threading Services": <FaHotjar />,
  // Default icon for any other service
  "default": <FaSpa />
};

const BeautyCate = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching beauty services...');
      // Fetch beauty services from the API with timeout
      const response = await axios.get('http://localhost:5001/services', {
        params: { category: 'Beauty' },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('Response received:', response.data);
      
      if (response.data && response.data.success) {
        // Add icons to the services
        const servicesWithIcons = response.data.services.map(service => ({
          ...service,
          icon: serviceIcons[service.name] || serviceIcons.default
        }));
        
        setServices(servicesWithIcons);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching beauty services:', err);
      
      let errorMessage = 'Failed to load services. Please try again.';
      
      // More detailed error messages based on error type
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error response:', err.response.data);
        errorMessage = `Server error (${err.response.status}): ${err.response.data.message || 'Unknown error'}`;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received from server');
        errorMessage = 'Could not connect to the server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', err.message);
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <CategoryPage categoryName="Beauty & Personal Care">
    <div className="category-page">
      <h1 className="category-title">💇 Beauty & Personal Care</h1>
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading services...</p>
              </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchServices} className="retry-button">
            <FaSync /> Try Again
          </button>
            </div>
      ) : (
        <div className="services-list">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))
          ) : (
            <p className="no-services">No beauty services available at this time.</p>
          )}
      </div>
      )}
    </div>
    </CategoryPage>
  );
};

export default BeautyCate; 
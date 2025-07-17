import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryPage.css';
import { FaBirthdayCake, FaRing, FaMusic, FaCamera, FaGift, FaUserTie, FaGlassCheers } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import CategoryPage from './CategoryPage';

// Default icon mapping for this category
const iconMapping = {
  "Wedding Planning": <FaRing />,
  "Birthday Party Organization": <FaBirthdayCake />,
  "DJ & Music Services": <FaMusic />,
  "Event Photography": <FaCamera />,
  "Gift & Decor Services": <FaGift />,
  "Event Host/MC Booking": <FaUserTie />,
  "Anniversary Celebrations": <FaGlassCheers />,
  // Default icon for any other service
  "default": <FaGlassCheers />
};

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://fixtime-i368.onrender.com";

const PrivateEvents = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/services`, {
          params: { category: 'Private Events' }
        });
        
        // Add icons to the services based on the mapping
        const servicesWithIcons = response.data.services.map(service => ({
          ...service,
          icon: iconMapping[service.name] || iconMapping.default
        }));
        
        setServices(servicesWithIcons);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [refreshTrigger]);

  const handleServiceAdded = (newService) => {
    // Trigger a refresh when a new service is added
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <CategoryPage 
      categoryName="Private Events"
      onServiceAdded={handleServiceAdded}
    >
      <div className="category-page">
        <h1 className="category-title">🎉 Private Events</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading-state">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="no-services-message">
            No services available in this category yet.
          </div>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </CategoryPage>
  );
};

export default PrivateEvents; 
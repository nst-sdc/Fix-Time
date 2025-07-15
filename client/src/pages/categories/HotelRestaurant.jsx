import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryPage.css';
import { FaHotel, FaUtensils, FaBirthdayCake, FaGlassCheers, FaConciergeBell, FaCocktail, FaChair } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import CategoryPage from './CategoryPage';
import { API_BASE_URL } from '../../App';

// Default icon mapping for this category
const iconMapping = {
  "Hotel Room Reservations": <FaHotel />,
  "Restaurant Table Bookings": <FaUtensils />,
  "Catering Services": <FaBirthdayCake />,
  "Event Space Reservations": <FaGlassCheers />,
  "Concierge Services": <FaConciergeBell />,
  "Bar & Lounge Reservations": <FaCocktail />,
  "Private Dining Arrangements": <FaChair />,
  // Default icon for any other service
  "default": <FaUtensils />
};

const HotelRestaurant = () => {
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
          params: { category: 'Hotels & Restaurants' }
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
      categoryName="Hotels & Restaurants"
      onServiceAdded={handleServiceAdded}
    >
    <div className="category-page">
        <h1 className="category-title">🍽️ Hotels & Restaurants</h1>
        
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

export default HotelRestaurant; 
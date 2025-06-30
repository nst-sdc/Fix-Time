// src/pages/Services.jsx
import React, { useState, useEffect } from "react";
import "./Services.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Services = () => {
  const navigate = useNavigate();
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/services');
        const services = response.data.data;
        
        // Group services by category
        const groupedServices = services.reduce((acc, service) => {
          const category = service.category || "Other";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(service);
          return acc;
        }, {});

        setServicesByCategory(groupedServices);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBooking = (service) => {
    navigate(`/book?serviceId=${service._id}&serviceName=${encodeURIComponent(service.name)}`);
  };

  const filteredCategories = Object.keys(servicesByCategory).filter((category) => {
    if (selectedCategory !== "All" && category !== selectedCategory) {
      return false;
    }
    const services = servicesByCategory[category];
    return services.some((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="loading-container">Loading services...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="services-page">
      <div className="services-container">
        <h1 className="services-title">Our Services</h1>
        <p className="services-subtitle">
          Find and book your desired service from a wide range of categories.
        </p>

        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search for a service..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.keys(servicesByCategory).sort().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="services-list">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category} className="service-category">
                <h2 className="category-title">{category}</h2>
                <div className="service-items">
                  {servicesByCategory[category]
                    .filter((service) =>
                      service.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((service) => (
                      <div key={service._id} className="service-item">
                        <span className="service-name">{service.name}</span>
                        <button
                          className="book-button"
                          onClick={() => handleBooking(service)}
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-services">
              <p>No services found matching your search criteria.</p>
              <p>Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>

        <p className="reminder-message">
          You'll receive timely reminders before your appointment.
        </p>
      </div>
    </div>
  );
};

export default Services;

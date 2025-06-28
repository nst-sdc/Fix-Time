import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaIdCard, FaPassport, FaUserCheck, FaGavel, FaFileContract } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import ServiceForm from '../../components/serviceForm';
const serviceData = [
  { name: "Driving License Appointment", icon: <FaIdCard /> },
  { name: "Passport Verification Slot Booking", icon: <FaPassport /> },
  { name: "Aadhar Update Booking", icon: <FaUserCheck /> },
  { name: "Legal Consultation (Advocate visit)", icon: <FaGavel /> },
  { name: "Property Registration / Stamp Duty Token", icon: <FaFileContract /> }
];

const GovernmentLegalServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
      <h1 className="category-title">📋 Government / Legal Services</h1>
      <button onClick={() => setShowForm(true)}>+ Add a Service</button>
      {/* Render the form conditionally */}
      {showForm && (
        <ServiceForm
        onClose={() => setShowForm(false)}
        onSuccess={() => {
        // Re-fetch or update the services list after submission
        const updatedServices = addRatingsToServices(serviceData);
        setServices(updatedServices);
        }}
        />
      )}
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

export default GovernmentLegalServices; 
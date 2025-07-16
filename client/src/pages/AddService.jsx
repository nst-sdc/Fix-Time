import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceForm from '../components/ServiceForm';

const AddService = ({ userProfile }) => {
  const navigate = useNavigate();

  // Only allow providers
  if (!userProfile || userProfile.role !== 'provider') {
    navigate('/login');
    return null;
  }

  return (
    <div className="services-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Add a New <span className="text-accent">Service</span></h2>
          <p className="section-subtitle">Fill out the details below to list a new service for booking.</p>
        </div>
        <ServiceForm 
          category={null}
          onClose={() => navigate('/my-services')}
          onSuccess={() => navigate('/my-services')}
        />
      </div>
    </div>
  );
};

export default AddService; 
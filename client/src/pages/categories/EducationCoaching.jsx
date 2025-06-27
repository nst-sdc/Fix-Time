import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaCalculator, FaMusic, FaPalette, FaLanguage, FaDumbbell, FaChild } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';

const serviceData = [
  { name: "Tuition Sessions (Math, Science, etc.)", icon: <FaCalculator /> },
  { name: "Music Lessons (Guitar, Piano)", icon: <FaMusic /> },
  { name: "Dance Classes", icon: <FaChild /> },
  { name: "Art & Craft Workshops", icon: <FaPalette /> },
  { name: "Language Learning Sessions", icon: <FaLanguage /> },
  { name: "Fitness / Yoga Trainers", icon: <FaDumbbell /> }
];

const EducationCoaching = () => {
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
      <h1 className="category-title">🧑‍🏫 Education & Coaching</h1>
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

export default EducationCoaching; 
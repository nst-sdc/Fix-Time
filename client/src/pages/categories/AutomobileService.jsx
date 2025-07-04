import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaCar, FaWind, FaUserCog, FaOilCan, FaShower } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import CategoryPage from './CategoryPage';
import { addRatingsToServices } from '../../utils/serviceUtils';

const serviceData = [
  { name: "Car/Bike Servicing", icon: <FaCar />, price: 800, description: "Routine servicing for cars and bikes.", provider: "AutoCare Garage", location: "12 Motorway, Mumbai", contact: "autocare@email.com", imageUrl: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=facearea&w=400&q=80", timeSlots: ["9AM - 11AM", "2PM - 4PM"] },
  { name: "Pollution Check Booking", icon: <FaWind />, price: 200, description: "Certified pollution check for all vehicles.", provider: "GreenTest Center", location: "88 Clean Dr, Pune", contact: "greentest@email.com", imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=facearea&w=400&q=80", timeSlots: ["10AM - 12PM", "3PM - 5PM"] },
  { name: "RTO Agent Consultations", icon: <FaUserCog />, price: 500, description: "RTO paperwork and consultation services.", provider: "RTO Assist", location: "22 License Rd, Delhi", contact: "rtoassist@email.com", imageUrl: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=facearea&w=400&q=80", timeSlots: ["11AM - 1PM", "4PM - 6PM"] },
  { name: "Tire & Oil Change", icon: <FaOilCan />, price: 600, description: "Quick tire and oil change for all vehicles.", provider: "QuickLube", location: "55 Service Ln, Bangalore", contact: "quicklube@email.com", imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=facearea&w=400&q=80", timeSlots: ["8AM - 10AM", "5PM - 7PM"] },
  { name: "Vehicle Cleaning / Detailing Services", icon: <FaShower />, price: 450, description: "Professional vehicle cleaning and detailing.", provider: "ShinePro Detailing", location: "33 Shine St, Hyderabad", contact: "shinepro@email.com", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80", timeSlots: ["7AM - 9AM", "6PM - 8PM"] }
];

const AutomobileService = () => {
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
    <CategoryPage categoryName="Automobile Services">
    <div className="category-page">
      <h1 className="category-title">🚗 Automobile Services</h1>
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

export default AutomobileService; 
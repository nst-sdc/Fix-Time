import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaBolt, FaWrench, FaSnowflake, FaWater, FaHammer, FaBug, FaCogs } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  { name: "Electrician Booking", icon: <FaBolt />, price: 350, description: "Certified electrician for home wiring, repairs, and installations.", provider: "SparkPro Services", location: "12 Main St, Mumbai", contact: "sparkpro@email.com", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80", timeSlots: ["10AM - 12PM", "2PM - 4PM"] },
  { name: "Plumber Booking", icon: <FaWrench />, price: 300, description: "Expert plumbing for leaks, fittings, and maintenance.", provider: "FlowFix Plumbing", location: "22 Water Lane, Pune", contact: "flowfix@email.com", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80", timeSlots: ["9AM - 11AM", "3PM - 5PM"] },
  { name: "AC Repair & Servicing", icon: <FaSnowflake />, price: 600, description: "AC installation, repair, and regular servicing.", provider: "CoolAir Solutions", location: "88 Chill Rd, Delhi", contact: "coolair@email.com", imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&q=80", timeSlots: ["11AM - 1PM", "4PM - 6PM"] },
  { name: "Water Purifier Maintenance", icon: <FaWater />, price: 400, description: "RO/UV water purifier cleaning and filter change.", provider: "PureDrop Services", location: "7 Aqua Ave, Bangalore", contact: "puredrop@email.com", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=facearea&w=400&q=80", timeSlots: ["10AM - 12PM", "1PM - 3PM"] },
  { name: "Carpenter Appointments", icon: <FaHammer />, price: 350, description: "Furniture repair, assembly, and custom carpentry.", provider: "WoodWorks", location: "55 Timber St, Hyderabad", contact: "woodworks@email.com", imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&q=80", timeSlots: ["12PM - 2PM", "5PM - 7PM"] },
  { name: "Pest Control Scheduling", icon: <FaBug />, price: 700, description: "Safe and effective pest control for home/office.", provider: "SafeHome Pest Control", location: "33 Green Rd, Chennai", contact: "safehome@email.com", imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&q=80", timeSlots: ["8AM - 10AM", "6PM - 8PM"] },
  { name: "Appliance Repairs (washing machine, fridge, etc.)", icon: <FaCogs />, price: 500, description: "Repairs for all major home appliances.", provider: "FixIt Appliances", location: "101 Repair St, Kolkata", contact: "fixit@email.com", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80", timeSlots: ["9AM - 11AM", "2PM - 4PM"] }
];

const HomeRepairServices = () => {
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
    <CategoryPage categoryName="Home & Repair Services">
    <div className="category-page">
      <h1 className="category-title">🧰 Home & Repair Services</h1>
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

export default HomeRepairServices; 
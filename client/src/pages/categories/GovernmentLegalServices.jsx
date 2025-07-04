import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaIdCard, FaPassport, FaUserCheck, FaGavel, FaFileContract } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  {
    name: "Driving License Appointment",
    icon: <FaIdCard />,
    provider: "RTO Express",
    description: "Book your slot for driving license application or renewal.",
    price: 350,
    duration: 30,
    address: "45 License Lane",
    city: "Mumbai",
    contact: "support@rtoexpress.com",
    timeSlots: ["10AM - 11AM", "2PM - 3PM"],
    avgRating: 4.1,
    totalReviews: 67,
    review: "Quick and efficient process!"
  },
  {
    name: "Passport Verification Slot Booking",
    icon: <FaPassport />,
    provider: "Passport Seva Kendra",
    description: "Book a slot for passport document verification.",
    price: 500,
    duration: 20,
    address: "12 Embassy Rd",
    city: "Delhi",
    contact: "help@passportseva.com",
    timeSlots: ["9AM - 10AM", "1PM - 2PM"],
    avgRating: 4.3,
    totalReviews: 52,
    review: "Staff was very helpful and polite."
  },
  {
    name: "Aadhar Update Booking",
    icon: <FaUserCheck />,
    provider: "UIDAI Center",
    description: "Book your slot for Aadhar card update or correction.",
    price: 100,
    duration: 15,
    address: "88 ID Park",
    city: "Bangalore",
    contact: "aadhar@uidai.gov.in",
    timeSlots: ["11AM - 12PM", "4PM - 5PM"],
    avgRating: 4.0,
    totalReviews: 39,
    review: "Fast service, minimal waiting."
  },
  {
    name: "Legal Consultation (Advocate visit)",
    icon: <FaGavel />,
    provider: "LegalEase Associates",
    description: "Consult with experienced advocates for your legal needs.",
    price: 1200,
    duration: 60,
    address: "101 Justice Ave",
    city: "Chennai",
    contact: "consult@legalease.com",
    timeSlots: ["3PM - 4PM", "6PM - 7PM"],
    avgRating: 4.6,
    totalReviews: 24,
    review: "Very knowledgeable and professional."
  },
  {
    name: "Property Registration / Stamp Duty Token",
    icon: <FaFileContract />,
    provider: "Registrar Office",
    description: "Book your slot for property registration and stamp duty.",
    price: 2500,
    duration: 45,
    address: "55 Registry Rd",
    city: "Pune",
    contact: "registry@maharashtra.gov.in",
    timeSlots: ["10AM - 11AM", "12PM - 1PM"],
    avgRating: 4.2,
    totalReviews: 31,
    review: "Smooth process, staff was supportive."
  }
];

const GovernmentLegalServices = () => {
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
    <CategoryPage categoryName="Government / Legal Services">
    <div className="category-page">
      <h1 className="category-title">📋 Government / Legal Services</h1>
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

export default GovernmentLegalServices; 
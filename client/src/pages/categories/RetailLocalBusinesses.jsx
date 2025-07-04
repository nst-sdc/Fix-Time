import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaTshirt, FaGem, FaStore, FaDog, FaGift, FaShoppingBag } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  {
    name: "Tailor Appointments (custom fitting)",
    icon: <FaTshirt />,
    provider: "StitchMaster Tailors",
    description: "Book a fitting session for custom clothing.",
    price: 400,
    duration: 45,
    address: "12 Fashion St",
    city: "Mumbai",
    contact: "fit@stitchmaster.com",
    timeSlots: ["11AM - 12PM", "5PM - 6PM"],
    avgRating: 4.3,
    totalReviews: 18,
    review: "Perfect fit every time!"
  },
  {
    name: "Jeweller Consultation (custom design)",
    icon: <FaGem />,
    provider: "Sparkle Jewels",
    description: "Consult with our experts for custom jewelry designs.",
    price: 0,
    duration: 30,
    address: "88 Gold Ave",
    city: "Delhi",
    contact: "design@sparklejewels.com",
    timeSlots: ["2PM - 3PM", "6PM - 7PM"],
    avgRating: 4.7,
    totalReviews: 25,
    review: "Beautiful designs and friendly staff."
  },
  {
    name: "Boutique Trials / Booking",
    icon: <FaStore />,
    provider: "Chic Boutique",
    description: "Book a trial session for the latest fashion.",
    price: 100,
    duration: 30,
    address: "55 Style Rd",
    city: "Bangalore",
    contact: "trials@chicboutique.com",
    timeSlots: ["1PM - 2PM", "4PM - 5PM"],
    avgRating: 4.2,
    totalReviews: 12,
    review: "Trendy collection and great service."
  },
  {
    name: "Pet Grooming Services",
    icon: <FaDog />,
    provider: "Paws & Claws",
    description: "Book a grooming session for your pets.",
    price: 600,
    duration: 60,
    address: "7 Pet Lane",
    city: "Chennai",
    contact: "groom@pawsclaws.com",
    timeSlots: ["10AM - 11AM", "3PM - 4PM"],
    avgRating: 4.8,
    totalReviews: 29,
    review: "My dog loves coming here!"
  },
  {
    name: "Custom Gift Makers or Artists",
    icon: <FaGift />,
    provider: "Gifted Hands",
    description: "Order custom gifts and artwork for any occasion.",
    price: 350,
    duration: 20,
    address: "101 Artistry Blvd",
    city: "Pune",
    contact: "order@giftedhands.com",
    timeSlots: ["12PM - 1PM", "6PM - 7PM"],
    avgRating: 4.5,
    totalReviews: 15,
    review: "Unique gifts, delivered on time."
  },
  {
    name: "Local Laundry / Dry Cleaning Pickup-Slots",
    icon: <FaShoppingBag />,
    provider: "CleanWave Laundry",
    description: "Book a pickup slot for laundry and dry cleaning.",
    price: 150,
    duration: 15,
    address: "33 Clean St",
    city: "Hyderabad",
    contact: "pickup@cleanwave.com",
    timeSlots: ["8AM - 9AM", "7PM - 8PM"],
    avgRating: 4.4,
    totalReviews: 21,
    review: "Fast and reliable service."
  }
];

const RetailLocalBusinesses = () => {
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
    <CategoryPage categoryName="Private Events">
    <div className="category-page">
      <h1 className="category-title">🛍️ Retail & Local Businesses</h1>
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

export default RetailLocalBusinesses; 
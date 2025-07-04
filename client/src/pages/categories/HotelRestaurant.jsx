import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaUtensils, FaBed, FaConciergeBell, FaGlassWhiskey, FaUsers, FaHotel } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  {
    name: "Table Reservation",
    icon: <FaUtensils />,
    provider: "Gourmet Palace",
    description: "Reserve a table at our fine dining restaurant for any occasion.",
    price: 0,
    duration: 90,
    address: "123 Foodie Lane",
    city: "Mumbai",
    contact: "table@gourmetpalace.com",
    timeSlots: ["12PM - 2PM", "7PM - 9PM"],
    avgRating: 4.7,
    totalReviews: 128,
    review: "Amazing ambiance and delicious food! Highly recommend."
  },
  {
    name: "Room Booking",
    icon: <FaBed />,
    provider: "City Comfort Hotel",
    description: "Book a comfortable room for your stay in the city.",
    price: 3500,
    duration: 1440,
    address: "88 Stay St",
    city: "Delhi",
    contact: "rooms@citycomfort.com",
    timeSlots: ["Check-in: 2PM", "Check-out: 12PM"],
    avgRating: 4.5,
    totalReviews: 89,
    review: "Clean rooms and friendly staff. Great value!"
  },
  {
    name: "Buffet Slot Reservation",
    icon: <FaConciergeBell />,
    provider: "Buffet Bliss",
    description: "Reserve your slot for our unlimited buffet experience.",
    price: 799,
    duration: 120,
    address: "55 Feast Ave",
    city: "Bangalore",
    contact: "buffet@bliss.com",
    timeSlots: ["1PM - 3PM", "8PM - 10PM"],
    avgRating: 4.3,
    totalReviews: 54,
    review: "So many options! Loved the desserts."
  },
  {
    name: "Private Dining Booking",
    icon: <FaGlassWhiskey />,
    provider: "Elite Eats",
    description: "Book a private dining room for special occasions.",
    price: 2500,
    duration: 180,
    address: "7 Elite Rd",
    city: "Hyderabad",
    contact: "private@eliteeats.com",
    timeSlots: ["6PM - 9PM"],
    avgRating: 4.8,
    totalReviews: 32,
    review: "Perfect for celebrations. Excellent service!"
  },
  {
    name: "Conference Room Reservation",
    icon: <FaUsers />,
    provider: "BizHub Hotel",
    description: "Reserve a conference room for meetings and events.",
    price: 2000,
    duration: 240,
    address: "101 Business Park",
    city: "Pune",
    contact: "conference@bizhub.com",
    timeSlots: ["9AM - 1PM", "2PM - 6PM"],
    avgRating: 4.2,
    totalReviews: 21,
    review: "Spacious and well-equipped."
  },
  {
    name: "Special Event Catering",
    icon: <FaHotel />,
    provider: "Celebrations Catering",
    description: "Book catering for weddings, parties, and corporate events.",
    price: 1200,
    duration: 300,
    address: "22 Event Rd",
    city: "Chennai",
    contact: "events@celebrations.com",
    timeSlots: ["On Request"],
    avgRating: 4.6,
    totalReviews: 47,
    review: "Delicious food and professional staff!"
  }
];

const HotelRestaurant = () => {
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
    <CategoryPage categoryName="Hotel & Restaurant">
    <div className="category-page">
      <h1 className="category-title">🏨 Hotel & Restaurant</h1>
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

export default HotelRestaurant; 
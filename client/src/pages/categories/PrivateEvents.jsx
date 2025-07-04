import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaCalendarAlt, FaChalkboardTeacher, FaBirthdayCake, FaRing, FaBuilding, FaGlassCheers } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  {
    name: "Webinar Booking",
    icon: <FaChalkboardTeacher />,
    provider: "EduWeb Events",
    description: "Book a slot for your next educational webinar.",
    price: 200,
    duration: 60,
    address: "Online Only",
    city: "Virtual",
    contact: "info@eduweb.com",
    timeSlots: ["10AM - 11AM", "5PM - 6PM"],
    avgRating: 4.5,
    totalReviews: 40,
    review: "Very informative and well-organized."
  },
  {
    name: "Seminar Registration",
    icon: <FaCalendarAlt />,
    provider: "SeminarPro",
    description: "Register for upcoming seminars on various topics.",
    price: 500,
    duration: 120,
    address: "123 Seminar Hall",
    city: "Delhi",
    contact: "register@seminarpro.com",
    timeSlots: ["2PM - 4PM"],
    avgRating: 4.2,
    totalReviews: 28,
    review: "Great speakers and networking opportunities."
  },
  {
    name: "Birthday Party Reservation",
    icon: <FaBirthdayCake />,
    provider: "PartyTime Planners",
    description: "Book a venue and services for birthday parties.",
    price: 3000,
    duration: 180,
    address: "77 Celebration Rd",
    city: "Mumbai",
    contact: "book@partytime.com",
    timeSlots: ["11AM - 2PM", "4PM - 7PM"],
    avgRating: 4.7,
    totalReviews: 53,
    review: "Kids had a blast! Decorations were amazing."
  },
  {
    name: "Wedding Venue Booking",
    icon: <FaRing />,
    provider: "DreamWeds",
    description: "Reserve a beautiful venue for your wedding day.",
    price: 25000,
    duration: 600,
    address: "1 Wedding Lane",
    city: "Jaipur",
    contact: "weddings@dreamweds.com",
    timeSlots: ["All Day"],
    avgRating: 4.9,
    totalReviews: 19,
    review: "The perfect wedding venue!"
  },
  {
    name: "Corporate Event Planning",
    icon: <FaBuilding />,
    provider: "BizEvents",
    description: "Plan and book your next corporate event with us.",
    price: 8000,
    duration: 360,
    address: "55 Business Park",
    city: "Bangalore",
    contact: "events@bizevents.com",
    timeSlots: ["9AM - 3PM"],
    avgRating: 4.4,
    totalReviews: 34,
    review: "Professional and seamless experience."
  },
  {
    name: "Anniversary Celebration Booking",
    icon: <FaGlassCheers />,
    provider: "Anniversary Bliss",
    description: "Book a venue and services for anniversary celebrations.",
    price: 3500,
    duration: 180,
    address: "22 Love St",
    city: "Chennai",
    contact: "celebrate@annibliss.com",
    timeSlots: ["6PM - 9PM"],
    avgRating: 4.6,
    totalReviews: 22,
    review: "Lovely ambiance and great service!"
  }
];

const PrivateEvents = () => {
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
      <h1 className="category-title">🎉 Private Events</h1>
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

export default PrivateEvents; 
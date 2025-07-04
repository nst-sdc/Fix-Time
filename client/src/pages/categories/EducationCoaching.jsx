import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaCalculator, FaMusic, FaPalette, FaLanguage, FaDumbbell, FaChild } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  {
    name: "Tuition Sessions (Math, Science, etc.)",
    icon: <FaCalculator />,
    provider: "BrightMinds Academy",
    description: "Book a session with expert tutors for all subjects.",
    price: 500,
    duration: 60,
    address: "22 Scholar St",
    city: "Delhi",
    contact: "info@brightminds.com",
    timeSlots: ["4PM - 5PM", "6PM - 7PM"],
    avgRating: 4.6,
    totalReviews: 33,
    review: "Helped my child improve grades!"
  },
  {
    name: "Music Lessons (Guitar, Piano)",
    icon: <FaMusic />,
    provider: "TuneIn Music School",
    description: "Learn guitar, piano, and more from professionals.",
    price: 700,
    duration: 45,
    address: "88 Melody Ave",
    city: "Mumbai",
    contact: "lessons@tunein.com",
    timeSlots: ["5PM - 5:45PM", "7PM - 7:45PM"],
    avgRating: 4.8,
    totalReviews: 27,
    review: "Fun and interactive classes."
  },
  {
    name: "Dance Classes",
    icon: <FaChild />,
    provider: "Groove Studio",
    description: "Join group or solo dance classes for all ages.",
    price: 600,
    duration: 60,
    address: "55 Rhythm Rd",
    city: "Bangalore",
    contact: "dance@groovestudio.com",
    timeSlots: ["6PM - 7PM", "8PM - 9PM"],
    avgRating: 4.7,
    totalReviews: 19,
    review: "Great instructors and energy!"
  },
  {
    name: "Art & Craft Workshops",
    icon: <FaPalette />,
    provider: "ArtNest",
    description: "Creative workshops for kids and adults.",
    price: 400,
    duration: 90,
    address: "101 Canvas Lane",
    city: "Chennai",
    contact: "workshops@artnest.com",
    timeSlots: ["3PM - 4:30PM"],
    avgRating: 4.5,
    totalReviews: 14,
    review: "Loved the hands-on activities!"
  },
  {
    name: "Language Learning Sessions",
    icon: <FaLanguage />,
    provider: "LinguaPro",
    description: "Book a session to learn new languages easily.",
    price: 550,
    duration: 60,
    address: "77 Polyglot St",
    city: "Pune",
    contact: "hello@linguapro.com",
    timeSlots: ["2PM - 3PM", "5PM - 6PM"],
    avgRating: 4.4,
    totalReviews: 22,
    review: "Practical and fun lessons."
  },
  {
    name: "Fitness / Yoga Trainers",
    icon: <FaDumbbell />,
    provider: "FitLife Studio",
    description: "Personal and group fitness/yoga sessions.",
    price: 800,
    duration: 60,
    address: "33 Wellness Ave",
    city: "Hyderabad",
    contact: "trainers@fitlife.com",
    timeSlots: ["7AM - 8AM", "6PM - 7PM"],
    avgRating: 4.9,
    totalReviews: 17,
    review: "Motivating trainers and great results!"
  }
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
    <CategoryPage categoryName="Education & Coaching">
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
    </CategoryPage>
  );
};

export default EducationCoaching; 
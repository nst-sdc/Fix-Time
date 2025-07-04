import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { FaUserMd, FaTooth, FaEye, FaWalking, FaVial, FaSyringe, FaCommentMedical, FaAppleAlt } from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard';
import { addRatingsToServices } from '../../utils/serviceUtils';
import CategoryPage from './CategoryPage';

const serviceData = [
  { name: "General Physician Appointments", icon: <FaUserMd />, price: 500, description: "Consultation with experienced general physicians.", provider: "City Health Clinic", location: "101 Main Rd, Mumbai", contact: "cityhealth@email.com", imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&q=80", timeSlots: ["10AM - 12PM", "3PM - 5PM"] },
  { name: "Dentist Checkups", icon: <FaTooth />, price: 700, description: "Routine dental checkups and cleaning.", provider: "Smile Dental Care", location: "22 Tooth Ave, Pune", contact: "smiledental@email.com", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80", timeSlots: ["9AM - 11AM", "2PM - 4PM"] },
  { name: "Eye Specialist Consultations", icon: <FaEye />, price: 600, description: "Eye exams and specialist consultations.", provider: "Vision Plus", location: "88 Vision St, Delhi", contact: "visionplus@email.com", imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&q=80", timeSlots: ["11AM - 1PM", "4PM - 6PM"] },
  { name: "Physiotherapy Sessions", icon: <FaWalking />, price: 800, description: "Personalized physiotherapy sessions.", provider: "FlexiCare Physio", location: "7 Flex Rd, Bangalore", contact: "flexicare@email.com", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80", timeSlots: ["10AM - 12PM", "1PM - 3PM"] },
  { name: "Lab Test Bookings", icon: <FaVial />, price: 1200, description: "Book lab tests with home sample collection.", provider: "LabXpress", location: "55 Test St, Hyderabad", contact: "labxpress@email.com", imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&q=80", timeSlots: ["12PM - 2PM", "5PM - 7PM"] },
  { name: "Vaccination Slots", icon: <FaSyringe />, price: 400, description: "Vaccination appointments for all ages.", provider: "VaxCare Center", location: "33 Health Rd, Chennai", contact: "vaxcare@email.com", imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&q=80", timeSlots: ["8AM - 10AM", "6PM - 8PM"] },
  { name: "Mental Health Counselling", icon: <FaCommentMedical />, price: 900, description: "Confidential mental health counselling sessions.", provider: "MindMatters", location: "101 Calm St, Kolkata", contact: "mindmatters@email.com", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80", timeSlots: ["9AM - 11AM", "2PM - 4PM"] },
  { name: "Nutritionist Consultations", icon: <FaAppleAlt />, price: 650, description: "Diet and nutrition consultations.", provider: "NutriLife", location: "77 Wellness Ave, Ahmedabad", contact: "nutrilife@email.com", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=facearea&w=400&q=80", timeSlots: ["10AM - 12PM", "4PM - 6PM"] }
];

const HealthcareCate = () => {
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
    <CategoryPage categoryName="Healthcare & Wellness">
    <div className="category-page">
      <h1 className="category-title">🏥 Healthcare & Wellness</h1>
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

export default HealthcareCate; 
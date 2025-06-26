import React from 'react';
import './CategoryPage.css';
import { FaCalculator, FaMusic, FaPalette, FaLanguage, FaDumbbell, FaChild } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const services = [
  { name: "Tuition Sessions (Math, Science, etc.)", icon: <FaCalculator /> },
  { name: "Music Lessons (Guitar, Piano)", icon: <FaMusic /> },
  { name: "Dance Classes", icon: <FaChild /> },
  { name: "Art & Craft Workshops", icon: <FaPalette /> },
  { name: "Language Learning Sessions", icon: <FaLanguage /> },
  { name: "Fitness / Yoga Trainers", icon: <FaDumbbell /> }
];

const EducationCoaching = () => {
  return (
    <div className="category-page">
      <h1 className="category-title">🧑‍🏫 Education & Coaching</h1>
      <div className="services-list">
        {services.map((service, idx) => (
          <Link to={`/book?service=${encodeURIComponent(service.name)}`} className="service-link" key={idx}>
            <div className="service-card">
              <div className="service-icon">{service.icon}</div>
              <div className="service-details">
                <p className="service-name">{service.name}</p>
                <button className="book-now-btn">Book Now</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EducationCoaching; 
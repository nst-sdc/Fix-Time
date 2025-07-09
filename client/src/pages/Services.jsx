// src/pages/Services.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const categories = [
  {
    emoji: "🏥",
    name: "Healthcare & Wellness",
    description: "Medical consultations, checkups and more",
    route: "/categories/healthcare"
  },
  {
    emoji: "💇",
    name: "Beauty & Personal Care",
    description: "Haircuts, spa, and grooming services",
    route: "/categories/beauty"
  },
  {
    emoji: "🧰",
    name: "Home & Repair Services",
    description: "Electricians, plumbers, and maintenance",
    route: "/categories/home-repair"
  },
  {
    emoji: "🧑‍🏫",
    name: "Education & Coaching",
    description: "Tutoring, music, fitness, and more",
    route: "/categories/education"
  },
  {
    emoji: "📋",
    name: "Government / Legal Services",
    description: "Legal, passport, and government services",
    route: "/categories/government-legal"
  },
  {
    emoji: "🚗",
    name: "Automobile Services",
    description: "Car/bike servicing, pollution check, etc.",
    route: "/categories/automobile"
  },
  {
    emoji: "🛍️",
    name: "Retail & Local Businesses",
    description: "Tailors, pet grooming, laundry, and more",
    route: "/categories/retail"
  },
  {
    emoji: "🎉",
    name: "Private Events",
    description: "Webinars, parties, and celebrations",
    route: "/categories/private-events"
  },
  {
    emoji: "🏨",
    name: "Hotel & Restaurant",
    description: "Table, room, and event bookings",
    route: "/categories/hotel-restaurant"
  },
  {
    emoji: "🗂️",
    name: "Others",
    description: "Miscellaneous and user-added services",
    route: "/categories/others"
  }
];

const Services = () => {
  return (
    <div className="services-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Explore Our <span className="text-accent">Services</span></h2>
          <p className="section-subtitle">Book appointments for a wide range of services and skip the queues!</p>
        </div>
        <div className="services-grid">
          {categories.map((cat, idx) => (
            <Link to={cat.route} className="service-category-link" key={cat.name}>
              <div className="service-category-card" data-aos="fade-up" data-aos-delay={100 + idx * 100}>
                <div className="category-icon">{cat.emoji}</div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;

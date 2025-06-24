// src/pages/Services.jsx
import React, { useState } from "react";

import "./Services.css"; 

const SERVICES = [
  { id: 1, name: "Haircut", category: "Salon" },
  { id: 2, name: "Dental Checkup", category: "Medical" },
  { id: 3, name: "Massage Therapy", category: "Wellness" },
  { id: 4, name: "Facial", category: "Salon" },
  { id: 5, name: "Eye Checkup", category: "Medical" },
  { id: 6, name: "Yoga Session", category: "Wellness" },
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredServices = SERVICES.filter(service => {
    const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "All" || service.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <>
      
      <div className="services-container">
        <h2>Services</h2>

        <div className="service-filters">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Salon">Salon</option>
            <option value="Medical">Medical</option>
            <option value="Wellness">Wellness</option>
          </select>
        </div>

        <div className="service-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <div className="service-card" key={service.id}>
                <h3>{service.name}</h3>
                <p>{service.category}</p>
              </div>
            ))
          ) : (
            <p>No services found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;

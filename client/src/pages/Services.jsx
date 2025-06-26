// src/pages/Services.jsx
import React, { useState } from "react";
import "./Services.css";
import { Link } from "react-router-dom";

const SERVICES = [
  {
    id: 1,
    category: "🏥 Healthcare & Wellness",
    services: [
      "General Physician Appointments",
      "Dentist Checkups",
      "Eye Specialist Consultations",
      "Physiotherapy Sessions",
      "Lab Test Bookings (blood test, X-rays)",
      "Vaccination Slots (especially flu, COVID)",
      "Mental Health Counselling",
      "Dietician/Nutritionist Consultations"
    ]
  },
  {
    id: 2,
    category: "💇 Beauty & Personal Care",
    services: [
      "Haircut & Styling",
      "Beard Grooming",
      "Hair Coloring / Smoothening",
      "Manicure & Pedicure",
      "Facial & Skin Treatment",
      "Bridal/Party Makeup Sessions",
      "Spa & Massage Appointments",
      "Waxing / Threading Services"
    ]
  },
  {
    id: 3,
    category: "🧰 Home & Repair Services",
    services: [
      "Electrician Booking",
      "Plumber Booking",
      "AC Repair & Servicing",
      "Water Purifier Maintenance",
      "Carpenter Appointments",
      "Pest Control Scheduling",
      "Appliance Repairs (washing machine, fridge, etc.)"
    ]
  },
  {
    id: 4,
    category: "🧑‍🏫 Education & Coaching",
    services: [
      "Tuition Sessions (Math, Science, etc.)",
      "Music Lessons (Guitar, Piano)",
      "Dance Classes",
      "Art & Craft Workshops",
      "Language Learning Sessions",
      "Fitness / Yoga Trainers"
    ]
  },
  {
    id: 5,
    category: "📋 Government / Legal Services",
    services: [
      "Driving License Appointment",
      "Passport Verification Slot Booking",
      "Aadhar Update Booking",
      "Legal Consultation (Advocate visit)",
      "Property Registration / Stamp Duty Token"
    ]
  },
  {
    id: 6,
    category: "🚗 Automobile Services",
    services: [
      "Car/Bike Servicing",
      "Pollution Check Booking",
      "RTO Agent Consultations",
      "Tire & Oil Change",
      "Vehicle Cleaning / Detailing Services"
    ]
  },
  {
    id: 7,
    category: "🛍️ Retail & Local Businesses",
    services: [
      "Tailor Appointments (custom fitting)",
      "Jeweller Consultation (custom design)",
      "Boutique Trials / Booking",
      "Pet Grooming Services",
      "Custom Gift Makers or Artists",
      "Local Laundry / Dry Cleaning Pickup-Slots"
    ]
  }
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Get all unique categories for the filter dropdown
  const categories = ["All", ...SERVICES.map(service => service.category)];

  // Flatten all services for search functionality
  const allServices = SERVICES.flatMap(category => 
    category.services.map(service => ({
      name: service,
      category: category.category
    }))
  );

  const filteredServices = allServices.filter(service => {
    const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "All" || service.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Group filtered services by category for display
  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service.name);
    return acc;
  }, {});

  return (
    <div className="services-page">
      <div className="services-container">
        <h1 className="services-heading">Explore Our Services</h1>
        <p className="services-subtitle">Book appointments for a wide range of services and skip the queues!</p>

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
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="service-grid">
          {Object.keys(groupedServices).length > 0 ? (
            Object.entries(groupedServices).map(([category]) => {
              // Map category to new route and emoji
              let route = "";
              let emoji = "";
              if (category.includes("Healthcare")) { route = "/categories/healthcare"; emoji = "🏥"; }
              else if (category.includes("Beauty")) { route = "/categories/beauty"; emoji = "💇"; }
              else if (category.includes("Home & Repair")) { route = "/categories/home-repair"; emoji = "🧰"; }
              else if (category.includes("Education")) { route = "/categories/education"; emoji = "🧑‍🏫"; }
              else if (category.includes("Government")) { route = "/categories/government-legal"; emoji = "📋"; }
              else if (category.includes("Automobile")) { route = "/categories/automobile"; emoji = "🚗"; }
              else if (category.includes("Retail")) { route = "/categories/retail"; emoji = "🛍️"; }
              return (
                <div className="service-category-card" key={category}>
                  <div className="category-emoji">{emoji}</div>
                  <h3 className="category-title">{category}</h3>
                  <Link to={route} className="btn btn-secondary" style={{marginTop: '1rem'}}>Show Category</Link>
                </div>
              );
            })
          ) : (
            <div className="no-services">
              <p>No services found matching your search criteria.</p>
              <p>Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;

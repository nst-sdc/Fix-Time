import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Services.css";
import ServiceForm from "../components/ServiceForm";
import { API_BASE_URL } from '../App';

// Local static categories
const SERVICES = [
  {
    id: 1,
    category: "🏥 Healthcare & Wellness",
    slug: "healthcare-wellness",
    backendCategory: "healthcare-wellness",
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
    slug: "beauty-personal-care",
    backendCategory: "beauty-personal-care",
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
  // ... (same for other categories)
];

const ServiceCategory = () => {
  const { categorySlug } = useParams();
  const categoryData = SERVICES.find(cat => cat.slug === categorySlug);
  const [dynamicServices, setDynamicServices] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (categoryData) {
      fetchDynamicServices();
    }
  }, [categorySlug]);

  const fetchDynamicServices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/services/category/${categorySlug}`);
      setDynamicServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  if (!categoryData) {
    return (
      <div className="services-page">
        <div className="services-container">
          <h2>Category Not Found</h2>
          <Link to="/services" className="btn btn-primary">Back to All Services</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="services-container">
        <h1 className="services-heading">{categoryData.category}</h1>
        <Link to="/services" className="btn btn-secondary" style={{marginBottom: '2rem', display: 'inline-block'}}>Back to All Categories</Link>

        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add a Service</button>

        {showForm && (
          <ServiceForm
            category={categorySlug}
            onClose={() => setShowForm(false)}
            onSuccess={fetchDynamicServices}
          />
        )}

        <h3 style={{marginTop: "2rem"}}>Popular Services:</h3>
        <div className="services-list">
          {categoryData.services.map((service, idx) => (
            <div className="service-item" key={idx}>
              <span className="service-name">{service}</span>
              <button className="book-now-btn">Book Now</button>
            </div>
          ))}
        </div>

        <h3 style={{marginTop: "2rem"}}>User Added Services:</h3>
        {dynamicServices.length === 0 ? (
          <p>No services added yet for this category.</p>
        ) : (
          <div className="services-list">
            {dynamicServices.map((s, idx) => (
              <div className="service-item" key={s._id || idx}>
                <span className="service-name">{s.name}</span>
                <p style={{ margin: "0.3rem 0" }}>{s.description}</p>
                <small><b>Provider:</b> {s.provider} | <b>Location:</b> {s.location}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCategory;

import React from "react";
import { useParams, Link } from "react-router-dom";
import "./Services.css";

const SERVICES = [
  {
    id: 1,
    category: "🏥 Healthcare & Wellness",
    slug: "healthcare-wellness",
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
    slug: "home-repair-services",
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
    slug: "education-coaching",
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
    slug: "government-legal-services",
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
    slug: "automobile-services",
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
    slug: "retail-local-businesses",
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

const ServiceCategory = () => {
  const { categorySlug } = useParams();
  const categoryData = SERVICES.find(cat => cat.slug === categorySlug);

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
        <div className="services-list" style={{marginTop: '2rem'}}>
          {categoryData.services.map((service, idx) => (
            <div className="service-item" key={idx}>
              <span className="service-name">{service}</span>
              <button className="book-now-btn">Book Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCategory; 
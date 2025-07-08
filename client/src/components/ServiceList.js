import React from 'react';
import ServiceCard from './ServiceCard';

const demoServices = [
  {
    _id: '1',
    name: 'Salon at Home',
    icon: '💇‍♀️',
    avgRating: 4.3,
    totalReviews: 12,
    price: 499,
    duration: 60,
    description: 'Professional salon services at the comfort of your home.',
    provider: 'UrbanClap',
    location: 'Mumbai',
    contact: '+91 9876543210',
    imageUrl: 'https://via.placeholder.com/300x200?text=Salon+at+Home'
  },
  {
    _id: '2',
    name: 'Plumber Service',
    icon: '🔧',
    avgRating: 4.7,
    totalReviews: 18,
    price: 299,
    duration: 30,
    description: 'Fix your leaks and blocks in minutes.',
    provider: 'Mr. Fixit',
    location: 'Delhi',
    contact: '+91 9876543211',
    imageUrl: 'https://via.placeholder.com/300x200?text=Plumber+Service'
  },
  {
    _id: '3',
    name: 'Maths Tutor',
    icon: '📘',
    avgRating: 4.9,
    totalReviews: 25,
    price: 599,
    duration: 45,
    description: 'One-on-one online coaching for school students.',
    provider: 'EduChamp',
    location: 'Online',
    contact: '+91 9876543212',
    imageUrl: 'https://via.placeholder.com/300x200?text=Maths+Tutor'
  }
];

const ServiceList = () => {
  return (
    <div className="service-list">
      <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Demo Services</h2>
      <div className="service-grid">
        {demoServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServiceList;

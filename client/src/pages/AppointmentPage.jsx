import React, { useState, useEffect } from 'react';
import AppointmentBooking from '../components/AppointmentBooking.jsx';
import ServiceReviews from '../components/ServiceReviews.jsx';
import { useLocation } from 'react-router-dom';
import './AppointmentPage.css';
import { fetchServiceRating } from '../utils/serviceUtils';
import { FaStar } from 'react-icons/fa';

const AppointmentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const service = searchParams.get('service');
  const [serviceId, setServiceId] = useState('mock-service-id'); // In a real app, this would come from API
  const [showReviews, setShowReviews] = useState(false);
  const [serviceRating, setServiceRating] = useState({ avgRating: 4.1, totalReviews: 3 });

  useEffect(() => {
    // In a real app, we would fetch the service details including its ID
    // For demo purposes, we're using a mock ID
    if (service) {
      // Mock service ID based on service name
      const mockId = `service-${service.replace(/\s+/g, '-').toLowerCase()}`;
      setServiceId(mockId);
      
      // Fetch service rating
      const getRating = async () => {
        try {
          const rating = await fetchServiceRating(mockId);
          setServiceRating(rating);
        } catch (error) {
          console.error('Error fetching service rating:', error);
          // Use default rating if fetch fails
          setServiceRating({ avgRating: 4.1, totalReviews: 3 });
        }
      };
      
      getRating();
    }
  }, [service]);

  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <h1>Book an Appointment</h1>
        {service && (
          <div className="service-info">
            <p className="service-subtitle">For: {service}</p>
            <div className="service-rating-summary">
              <div className="rating-display">
                <FaStar className="star-icon" />
                <span className="rating-value">{serviceRating.avgRating}</span>
              </div>
              <button 
                className="view-reviews-btn"
                onClick={() => setShowReviews(!showReviews)}
              >
                {showReviews ? 'Hide Reviews' : 'View Reviews'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showReviews && service && (
        <div className="service-reviews-section">
          <ServiceReviews serviceId={serviceId} />
        </div>
      )}
      
      <AppointmentBooking />
    </div>
  );
};

export default AppointmentPage;

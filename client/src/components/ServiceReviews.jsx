import React, { useState, useEffect } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './ServiceReviews.css';

const ServiceReviews = ({ serviceId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Generate mock reviews for demo mode
  const generateMockReviews = () => {
    const mockReviews = [
      {
        _id: 'review-1',
        rating: 5,
        comment: 'Excellent service! Very professional and timely.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: { email: 'john.doe@example.com' }
      },
      {
        _id: 'review-2',
        rating: 4,
        comment: 'Great experience overall. Would recommend to others.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        userId: { email: 'sarah.smith@example.com' }
      },
      {
        _id: 'review-3',
        rating: 5,
        comment: 'Very satisfied with the quality of service!',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        userId: { email: 'mike.johnson@example.com' }
      }
    ];
    
    return mockReviews;
  };

  // Check if we're in demo mode
  const isDemoMode = () => {
    return serviceId && (typeof serviceId === 'string' && 
      (serviceId.includes('mock') || serviceId.includes('service-')));
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Handle demo mode
        if (isDemoMode()) {
          console.log('Demo mode detected, using mock reviews');
          // Simulate API delay
          setTimeout(() => {
            setReviews(generateMockReviews());
            setLoading(false);
          }, 800);
          return;
        }
        
        const response = await axios.get(`http://localhost:5001/reviews/service/${serviceId}`);
        setReviews(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        
        // If API call fails, use mock data in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock reviews after API error');
          setReviews(generateMockReviews());
          setLoading(false);
        } else {
          setError('Could not load reviews');
          setLoading(false);
        }
      }
    };

    if (serviceId) {
      fetchReviews();
    }
  }, [serviceId]);

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="review-loading">Loading reviews...</div>;
  }

  if (error) {
    return <div className="review-error">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="no-reviews">No reviews yet for this service.</div>;
  }

  return (
    <div className="service-reviews">
      <h3 className="reviews-title">Customer Reviews ({reviews.length})</h3>
      
      <div className="reviews-list">
        {reviews.map((review) => (
          <div className="review-item" key={review._id}>
            <div className="review-header">
              <div className="review-user">
                <FaUser className="user-icon" />
                <span className="user-name">
                  {review.userId?.email?.split('@')[0] || 'Anonymous'}
                </span>
              </div>
              <div className="review-date">{formatDate(review.createdAt)}</div>
            </div>
            
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < review.rating ? 'star-filled' : 'star-empty'} 
                />
              ))}
            </div>
            
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceReviews; 
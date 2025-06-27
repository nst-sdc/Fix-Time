import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaUser, FaCalendarAlt, FaClock, FaHistory, FaPhone, FaMapPin, FaEnvelope } from 'react-icons/fa';

const Dashboard = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();

  if (!userProfile) {
    return <div className="loading-container">Loading user profile...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatGender = (gender) => {
    if (!gender) return 'Not specified';
    return gender.charAt(0).toUpperCase() + gender.slice(1).replace('-', ' ');
  };

  const handleBookNow = () => {
    navigate('/appointments');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, <span className="user-name">{userProfile.fullName || userProfile.email?.split('@')[0] || 'User'}</span>!</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-panel user-profile-panel">
          <div className="panel-header">
            <FaUser className="panel-icon" />
            <h2>User Profile</h2>
          </div>
          
          <div className="profile-details">
            <div className="profile-avatar-large">
              <FaUser />
            </div>
            
            <div className="profile-info-container">
              <div className="profile-info-item">
                <span className="info-label">
                  <FaUser className="info-icon" />
                  Full Name:
                </span>
                <span className="info-value">{userProfile.fullName || 'Not provided'}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">
                  <FaEnvelope className="info-icon" />
                  Email:
                </span>
                <span className="info-value">{userProfile.email}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">
                  <FaPhone className="info-icon" />
                  Phone:
                </span>
                <span className="info-value">{userProfile.phoneNumber || 'Not provided'}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">
                  <FaMapPin className="info-icon" />
                  Address:
                </span>
                <span className="info-value">{userProfile.address || 'Not provided'}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">Gender:</span>
                <span className="info-value">{formatGender(userProfile.gender)}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">
                  <FaCalendarAlt className="info-icon" />
                  Member Since:
                </span>
                <span className="info-value">
                  {formatDate(userProfile.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-panel upcoming-appointments">
          <div className="panel-header">
            <FaCalendarAlt className="panel-icon" />
            <h2>Upcoming Appointments</h2>
          </div>
          
          <div className="empty-state">
            <FaClock className="empty-icon" />
            <p>You don't have any upcoming appointments.</p>
            <button className="book-btn" onClick={handleBookNow}>Book Now</button>
          </div>
        </div>
        
        <div className="dashboard-panel appointment-history">
          <div className="panel-header">
            <FaHistory className="panel-icon" />
            <h2>Appointment History</h2>
          </div>
          
          <div className="empty-state">
            <p>You don't have any past appointments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
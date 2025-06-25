import React from 'react';
import './Dashboard.css';
import { FaUser, FaCalendarAlt, FaClock, FaHistory } from 'react-icons/fa';

const Dashboard = ({ userProfile, setUserProfile }) => {
  if (!userProfile) {
    return <div className="loading-container">Loading user profile...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, <span className="user-name">{userProfile.email?.split('@')[0] || 'User'}</span>!</p>
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
                <span className="info-label">Email:</span>
                <span className="info-value">{userProfile.email}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {userProfile.createdAt 
                    ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric'
                      }) 
                    : 'N/A'}
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
            <button className="book-btn">Book Now</button>
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FaUser, FaCalendarAlt, FaClock, FaHistory, FaAngleDown, FaAngleUp, FaEnvelope, FaCalendarDay } from 'react-icons/fa';
import AppointmentDetails from '../components/AppointmentDetails';

const Dashboard = ({ userProfile, setUserProfile }) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandHistory, setExpandHistory] = useState(false);

  // Mock appointments data - in a real app, would come from API
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    
    setTimeout(() => {
      // Mock data
      const mockUpcoming = [
        {
          _id: 'appt-001',
          serviceName: 'Haircut & Styling',
          date: new Date(Date.now() + 86400000 * 3), // 3 days from now
          time: '10:00 AM',
          status: 'scheduled'
        },
        {
          _id: 'appt-002',
          serviceName: 'Beard Grooming',
          date: new Date(Date.now() + 86400000 * 7), // 7 days from now
          time: '2:30 PM',
          status: 'scheduled'
        }
      ];
      
      const mockPast = [
        {
          _id: 'appt-003',
          serviceName: 'Spa & Massage',
          date: new Date(Date.now() - 86400000 * 5), // 5 days ago
          time: '3:30 PM',
          status: 'completed',
          hasReviewed: true
        },
        {
          _id: 'appt-004',
          serviceName: 'Facial Treatment',
          date: new Date(Date.now() - 86400000 * 10), // 10 days ago
          time: '11:30 AM',
          status: 'completed',
          hasReviewed: false
        },
        {
          _id: 'appt-005',
          serviceName: 'Hair Coloring',
          date: new Date(Date.now() - 86400000 * 15), // 15 days ago
          time: '9:00 AM',
          status: 'cancelled'
        }
      ];
      
      setUpcomingAppointments(mockUpcoming);
      setPastAppointments(mockPast);
      setLoading(false);
    }, 1000);
  }, []);

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
                <span className="info-label"><FaEnvelope /> Email:</span>
                <span className="info-value">{userProfile.email}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label"><FaCalendarDay /> Member Since:</span>
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
            <Link to="/calendar" className="view-calendar-link">
              View Calendar
            </Link>
          </div>
          
          {loading ? (
            <div className="loading-state">Loading appointments...</div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="appointments-list">
              {upcomingAppointments.map(appointment => (
                <AppointmentDetails 
                  key={appointment._id} 
                  appointment={appointment} 
                />
              ))}
            </div>
          ) : (
          <div className="empty-state">
            <FaClock className="empty-icon" />
            <p>You don't have any upcoming appointments.</p>
              <Link to="/services" className="book-btn">Book Now</Link>
          </div>
          )}
        </div>
        
        <div className="dashboard-panel appointment-history">
          <div className="panel-header" onClick={() => setExpandHistory(!expandHistory)}>
            <div className="header-content">
            <FaHistory className="panel-icon" />
            <h2>Appointment History</h2>
            </div>
            <div className="expand-icon">
              {expandHistory ? <FaAngleUp /> : <FaAngleDown />}
            </div>
          </div>
          
          {expandHistory && (
            <>
              {loading ? (
                <div className="loading-state">Loading history...</div>
              ) : pastAppointments.length > 0 ? (
                <div className="appointments-list">
                  {pastAppointments.map(appointment => (
                    <AppointmentDetails 
                      key={appointment._id} 
                      appointment={appointment} 
                    />
                  ))}
                </div>
              ) : (
          <div className="empty-state">
            <p>You don't have any past appointments.</p>
          </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
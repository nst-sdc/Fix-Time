import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FaUser, FaCalendarAlt, FaClock, FaHistory, FaAngleDown, FaAngleUp, FaEnvelope, FaCalendarDay } from 'react-icons/fa';
import AppointmentDetails from '../components/AppointmentDetails';
import axios from 'axios';

const Dashboard = ({ userProfile, setUserProfile }) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandHistory, setExpandHistory] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view appointments.');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:5001/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const validAppointments = response.data.appointments.filter(appt => appt.serviceName !== 'Unknown Service');
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          setUpcomingAppointments(validAppointments.filter(appt => {
            const apptDate = new Date(appt.date);
            return apptDate >= today && ['scheduled', 'confirmed', 'in-progress'].includes(appt.status);
          }));
          setPastAppointments(validAppointments.filter(appt => {
            const apptDate = new Date(appt.date);
            // Past if before today, or if status is completed/cancelled/no-show (even if in the future)
            return apptDate < today || ['completed', 'cancelled', 'no-show'].includes(appt.status);
          }));
        } else {
          setError('Failed to fetch appointments');
        }
      } catch (err) {
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
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
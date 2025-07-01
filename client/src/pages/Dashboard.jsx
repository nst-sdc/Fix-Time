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

  // Fetch real appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        console.log('Dashboard: Starting to fetch appointments');
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('Dashboard: No token found');
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        console.log('Dashboard: Making API call to /appointments');
        const response = await fetch('http://localhost:5001/appointments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Dashboard: Response status:', response.status);
        console.log('Dashboard: Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.log('Dashboard: Error response:', errorText);
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        console.log('Dashboard: Received data:', data);
        
        // Separate upcoming and past appointments
        const now = new Date();
        const upcoming = [];
        const past = [];

        data.appointments.forEach(appointment => {
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(parseInt(appointment.time.split(':')[0]), 
                                 parseInt(appointment.time.split(':')[1].split(' ')[0]), 0, 0);
          
          if (appointment.time.includes('PM') && !appointment.time.includes('12:')) {
            appointmentDate.setHours(appointmentDate.getHours() + 12);
          }
          
          if (appointmentDate > now) {
            upcoming.push(appointment);
          } else {
            past.push(appointment);
          }
        });

        console.log('Dashboard: Upcoming appointments:', upcoming);
        console.log('Dashboard: Past appointments:', past);

        // Sort upcoming appointments by date (earliest first)
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Sort past appointments by date (most recent first)
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
        setError(null);
      } catch (err) {
        console.error('Dashboard: Error fetching appointments:', err);
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

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

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
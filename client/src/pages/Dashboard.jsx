import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import {
  FaUser, FaCalendarAlt, FaClock, FaHistory,
  FaAngleDown, FaAngleUp, FaEnvelope, FaCalendarDay
} from 'react-icons/fa';
import AppointmentDetails from '../components/AppointmentDetails';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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

        const response = await axios.get(`${API_BASE_URL}/appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const now = new Date();
          const appointments = response.data.appointments.map(appt => {
            // Combine date and time to get full appointment datetime
            const [time, meridian] = appt.time.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (meridian === 'PM' && hours !== 12) hours += 12;
            if (meridian === 'AM' && hours === 12) hours = 0;

            const apptDateTime = new Date(appt.date);
            apptDateTime.setHours(hours);
            apptDateTime.setMinutes(minutes);
            apptDateTime.setSeconds(0);

            if (apptDateTime < now && appt.status === 'confirmed') {
              return { ...appt, status: 'completed' };
            }

            return appt;
          });

          setUpcomingAppointments(appointments.filter(appt => {
            const apptDate = new Date(appt.date);
            return new Date(appt.date) >= new Date().setHours(0,0,0,0)
              && ['scheduled', 'confirmed', 'in-progress'].includes(appt.status);
          }));

          setPastAppointments(appointments.filter(appt => {
            const apptDate = new Date(appt.date);
            return new Date(appt.date) < new Date().setHours(0,0,0,0)
              || ['completed', 'cancelled', 'no-show'].includes(appt.status);
          }));
        } else {
          setError('Failed to fetch appointments.');
        }
      } catch (err) {
        setError('Error loading appointments.');
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

        {/* User Profile Panel */}
        <div className="dashboard-panel user-profile-panel">
          <div className="panel-header">
            <FaUser className="panel-icon" />
            <h2>User Profile</h2>
          </div>
          <div className="profile-details">
            <div className="profile-avatar-large"><FaUser /></div>
            <div className="profile-info-container">
              <div className="profile-info-item">
                <span className="info-label"><FaEnvelope /> Email:</span>
                <span className="info-value">{userProfile.email}</span>
              </div>
              <div className="profile-info-item">
                <span className="info-label"><FaCalendarDay /> Member Since:</span>
                <span className="info-value">
                  {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="dashboard-panel upcoming-appointments">
          <div className="panel-header">
            <FaCalendarAlt className="panel-icon" />
            <h2>Upcoming Appointments</h2>
            <Link to="/calendar" className="view-calendar-link">View Calendar</Link>
          </div>
          {loading ? (
            <div className="loading-state">Loading appointments...</div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="appointments-list">
              {upcomingAppointments.map(appt => (
                <AppointmentDetails key={appt._id} appointment={appt} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaClock className="empty-icon" />
              <p>No upcoming appointments.</p>
              <Link to="/services" className="book-btn">Book Now</Link>
            </div>
          )}
        </div>

        {/* Past Appointments */}
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
                  {pastAppointments.map(appt => (
                    <AppointmentDetails key={appt._id} appointment={appt} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No past appointments.</p>
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

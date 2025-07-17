import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import {
  FaUser, FaCalendarAlt, FaClock, FaHistory,
  FaAngleDown, FaAngleUp, FaEnvelope, FaCalendarDay
} from 'react-icons/fa';
import AppointmentDetails from '../components/AppointmentDetails';
import axios from 'axios';
import { API_BASE_URL } from '../App';

const Dashboard = ({ userProfile, setUserProfile }) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandHistory, setExpandHistory] = useState(false);
  const [bookedFilter, setBookedFilter] = useState('Upcoming');
  const bookedFilters = ['Upcoming', 'Today', 'Scheduled', 'Past', 'Cancelled', 'All'];
  const [recentProviderBookings, setRecentProviderBookings] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState('');
  const [allProviderAppointments, setAllProviderAppointments] = useState([]);

  // Helper to check if appointment is in the future
  function isFutureAppointment(dateStr, timeStr) {
    if (!dateStr || !timeStr) return false;
    let hours = 0, minutes = 0;
    let t = timeStr.trim();
    let ampm = '';
    if (/am|pm|AM|PM/.test(t)) {
      const [time, meridian] = t.split(/\s+/);
      [hours, minutes] = time.split(":").map(Number);
      ampm = meridian.toUpperCase();
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    } else {
      [hours, minutes] = t.split(":").map(Number);
    }
    const apptDate = new Date(dateStr);
    apptDate.setHours(hours);
    apptDate.setMinutes(minutes);
    apptDate.setSeconds(0);
    return apptDate > new Date();
  }
  const todayStr = new Date().toISOString().slice(0, 10);
  const filteredBooked = upcomingAppointments.filter(b => {
    if (bookedFilter === 'Upcoming') return isFutureAppointment(b.date, b.time);
    if (bookedFilter === 'Today') return b.date && b.date.slice(0, 10) === todayStr;
    if (bookedFilter === 'Scheduled') return b.status === 'scheduled';
    if (bookedFilter === 'Past') return b.status === 'completed' || b.status === 'no-show';
    if (bookedFilter === 'Cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

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

  useEffect(() => {
    if (userProfile?.role === 'provider') {
      const fetchProviderAppointments = async () => {
        setRecentLoading(true);
        setRecentError('');
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:5001/appointments/provider', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data && res.data.appointments) {
            // Sort by date/time descending
            const sorted = res.data.appointments.slice().sort((a, b) => {
              const dateA = new Date(a.date + ' ' + a.time);
              const dateB = new Date(b.date + ' ' + b.time);
              return dateB - dateA;
            });
            setRecentProviderBookings(sorted.slice(0, 5));
            setAllProviderAppointments(sorted); // <-- store all
          } else {
            setRecentProviderBookings([]);
            setAllProviderAppointments([]);
          }
        } catch (err) {
          setRecentError('Failed to load recent bookings.');
          setAllProviderAppointments([]);
        } finally {
          setRecentLoading(false);
        }
      };
      fetchProviderAppointments();
    }
  }, [userProfile]);

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
        <div className="dashboard-panel user-profile-panel enhanced-profile-panel">
          <div className="profile-avatar-large">
            {userProfile.fullName
              ? userProfile.fullName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
              : <FaUser />}
          </div>
          <div className="user-details-grid">
            <div className="user-detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">{userProfile.fullName || 'Not provided'}</span>
            </div>
            <div className="user-detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{userProfile.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="user-detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{userProfile.email}</span>
            </div>
          </div>
          <div className="main-options-row">
            <Link to="/profile" className="main-option-btn">Edit Profile</Link>
            <button className="main-option-btn logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
          </div>
        </div>

        {/* Booked Services Panel */}
        <div className="dashboard-panel upcoming-appointments">
          <div className="panel-header">
            <FaCalendarAlt className="panel-icon" />
            <h2>Booked Services</h2>
            <Link to="/calendar" className="view-calendar-link">View Calendar</Link>
          </div>
          <div className="booking-filters" style={{marginBottom: '1.2rem'}}>
            {bookedFilters.map(f => (
              <button key={f} className={bookedFilter === f ? 'active' : ''} onClick={() => setBookedFilter(f)}>{f}</button>
            ))}
          </div>
          {/* Recent Bookings (for provider) */}
          {userProfile.role === 'provider' && (
            <div className="recent-bookings-list" style={{marginBottom: '1.2rem'}}>
              {recentLoading ? (
                <div className="loading-state">Loading recent bookings...</div>
              ) : recentError ? (
                <div className="empty-state">{recentError}</div>
              ) : recentProviderBookings.length === 0 ? (
                <div className="empty-state">No recent bookings found.</div>
              ) : (
                recentProviderBookings.map(b => (
                  <div className="recent-booking-item" key={b._id}>
                    <div className="recent-booking-main">
                      <span className="recent-booking-customer">{b.customerName || b.customerEmail}</span>
                      <span className={`recent-booking-status status-${b.status?.toLowerCase()}`}>{b.status}</span>
                    </div>
                    <div className="recent-booking-details">
                      <span>{b.serviceName}</span>
                      <span>{b.date?.slice(0, 10)} {b.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {loading ? (
            <div className="loading-state">Loading appointments...</div>
          ) : filteredBooked.length > 0 ? (
            <div className="appointments-list">
              {filteredBooked.map(appt => (
                <AppointmentDetails key={appt._id} appointment={appt} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaClock className="empty-icon" />
              <p>No booked services in this category.</p>
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
              {userProfile.role === 'provider' ? (
                recentLoading ? (
                  <div className="loading-state">Loading history...</div>
                ) : allProviderAppointments.length > 0 ? (
                  <div className="appointments-list">
                    {allProviderAppointments.map(appt => (
                      <AppointmentDetails key={appt._id} appointment={appt} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No booked appointments found.</p>
                  </div>
                )
              ) : loading ? (
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

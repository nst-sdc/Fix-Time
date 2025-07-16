import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import './ProviderHomePage.css';
import { FaCalendarAlt, FaUser, FaClock, FaMoneyBillWave, FaEnvelope, FaChartBar, FaToggleOn, FaToggleOff, FaBell, FaUserEdit, FaListAlt, FaComments, FaQuestionCircle, FaUserCheck } from 'react-icons/fa';
import AppointmentDetails from '../components/AppointmentDetails';
import ServiceReviews from '../components/ServiceReviews';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { navigateToTop } from '../utils/useScrollToTop';

// Dummy data for now
const dummyAppointments = [
  { _id: '1', serviceName: 'Dental Checkup', clientName: 'John Doe', time: '10:00 AM', date: new Date().toISOString(), status: 'scheduled' },
  { _id: '2', serviceName: 'Haircut', clientName: 'Jane Smith', time: '11:30 AM', date: new Date().toISOString(), status: 'confirmed' },
  { _id: '3', serviceName: 'Consultation', clientName: 'Bob Lee', time: '1:00 PM', date: new Date().toISOString(), status: 'scheduled' },
];
const dummyNotifications = [
  { id: 1, message: 'You have a booking in 10 minutes.', time: 'Just now' },
  { id: 2, message: 'Client Jane Smith left a new review.', time: '5 min ago' },
  { id: 3, message: 'System: Your payout was processed.', time: '1 hr ago' },
];
const dummyReviews = [
  { _id: 'r1', user: 'Alice', rating: 5, comment: 'Amazing experience! My clients love the queue-free booking.', date: '2024-06-01' },
  { _id: 'r2', user: 'Bob', rating: 4, comment: 'Very easy to manage my schedule and clients.', date: '2024-05-28' },
  { _id: 'r3', user: 'Priya', rating: 5, comment: 'No more chaos at my clinic. Highly recommend FixTime!', date: '2024-05-20' },
];

const ProviderHomePage = () => {
  const navigate = useNavigate();
  const [queueOpen, setQueueOpen] = useState(true);
  const [nowServing, setNowServing] = useState('John Doe');
  const [nextAppointment, setNextAppointment] = useState('11:30 AM');
  const [stats, setStats] = useState({
    totalToday: 0,
    noShows: 0,
    avgWait: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState('');
  const [notifPulse, setNotifPulse] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [errorUpcoming, setErrorUpcoming] = useState('');
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  // Function to navigate with scroll to top
  const handleNavigateToTop = (path) => {
    navigateToTop(navigate, path);
  };

  useEffect(() => {
    AOS.init({ duration: 1200, easing: 'ease-out', once: true });
    const interval = setInterval(() => setNotifPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoadingUpcoming(true);
      setErrorUpcoming('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/appointments/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.appointments) {
          // Only future appointments, sorted by date/time
          const now = new Date();
          const upcomingSorted = res.data.appointments
            .filter(a => {
              // Combine date and time
              let apptDate = new Date(a.date);
              let [h, m] = (a.time || '').split(/:| /).map(Number);
              if (/pm/i.test(a.time) && h !== 12) h += 12;
              if (/am/i.test(a.time) && h === 12) h = 0;
              apptDate.setHours(h || 0);
              apptDate.setMinutes(m || 0);
              return apptDate > now && ['scheduled','confirmed','pending'].includes(a.status);
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
          setUpcoming(upcomingSorted);
        } else {
          setUpcoming([]);
        }
      } catch (err) {
        setErrorUpcoming('Could not load upcoming appointments.');
      } finally {
        setLoadingUpcoming(false);
      }
    };
    fetchUpcoming();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setErrorStats('');
      try {
        const token = localStorage.getItem('token');
        // Fetch appointments for today
        const appointmentsRes = await axios.get('http://localhost:5001/appointments/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Fetch provider's services for average duration
        const servicesRes = await axios.get('http://localhost:5001/services/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (appointmentsRes.data.appointments && servicesRes.data.services) {
          const today = new Date().toISOString().slice(0, 10);
          const todayAppointments = appointmentsRes.data.appointments.filter(a => 
            a.date && a.date.slice(0, 10) === today
          );
          const noShows = todayAppointments.filter(a => a.status === 'no-show').length;
          
          // Calculate average duration from provider's services
          const services = servicesRes.data.services;
          const avgDuration = services.length > 0 
            ? Math.round(services.reduce((sum, s) => sum + (s.duration || 0), 0) / services.length)
            : 0;
          
          setStats({
            totalToday: todayAppointments.length,
            noShows: noShows,
            avgWait: avgDuration,
          });
        }
      } catch (err) {
        setErrorStats('Could not load activity stats.');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/appointments/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.appointments) {
          // Calculate bookings for next 30 days
          const next30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            return d.toISOString().slice(0, 10);
          });
          
          const dayBookings = next30Days.map(date => {
            const bookings = res.data.appointments.filter(a => 
              a.date && a.date.slice(0, 10) === date
            ).length;
            return { date, bookings };
          });
          
          setAvailabilityData(dayBookings);
        }
      } catch (err) {
        console.error('Failed to load availability data:', err);
      } finally {
        setLoadingAvailability(false);
      }
    };
    fetchAvailability();
  }, []);

  // Animated counter
  const AnimatedCounter = ({ value }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = value;
      if (start === end) return;
      let increment = end > start ? 1 : -1;
      const timer = setInterval(() => {
        start += increment;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, 30);
      return () => clearInterval(timer);
    }, [value]);
    return <span>{count}</span>;
  };

  // Mini calendar widget with real data
  const MiniCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get the first day of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Calculate how many days to show (from today to end of month + some days from next month)
    const daysFromToday = 30;
    const daysToShow = Math.min(daysFromToday, lastDayOfMonth.getDate() - today.getDate() + 1);
    
    const getDayClass = (dayOffset) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayOffset);
      const dateString = targetDate.toISOString().slice(0, 10);
      
      const dayData = availabilityData.find(d => d.date === dateString);
      if (!dayData) return 'calendar-day';
      
      if (dayData.bookings > 5) return 'calendar-day busy';
      if (dayData.bookings > 0) return 'calendar-day green';
      return 'calendar-day';
    };

    const getDayNumber = (dayOffset) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayOffset);
      return targetDate.getDate();
    };

    return (
      <div className="mini-calendar-widget animated-pop" data-aos="fade-left">
        <div className="calendar-header">
          {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="calendar-grid">
          {[...Array(7)].map((_, i) => (
            <div className="calendar-day-label" key={i}>{['S','M','T','W','T','F','S'][i]}</div>
          ))}
          {[...Array(daysToShow)].map((_, i) => (
            <div className={getDayClass(i)} key={i} title={`${getDayNumber(i)} ${today.toLocaleDateString('en-US', { month: 'short' })}`}>
              {getDayNumber(i)}
            </div>
          ))}
        </div>
        <div className="calendar-legend">
          <span className="dot busy"></span> Busy (&gt;5)
          <span className="dot green"></span> Booked (1-5)
        </div>
      </div>
    );
  };

  // Dummy review cards
  const ReviewCard = ({ review }) => (
    <div className="review-card animated-pop" data-aos="fade-up">
      <div className="review-header">
        <FaUser className="review-user-icon" />
        <span className="review-user">{review.user}</span>
        <span className="review-date">{review.date}</span>
      </div>
      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < review.rating ? 'star-filled' : 'star-empty'}>★</span>
        ))}
      </div>
      <div className="review-comment">{review.comment}</div>
    </div>
  );

  // Helper to format time to 12-hour with AM/PM
  const formatTime12h = (timeStr) => {
    if (!timeStr) return '';
    // If already in 12-hour format with AM/PM, return as is
    if (/am|pm|AM|PM/.test(timeStr)) return timeStr;
    // If in HH:MM format, convert
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    let hour = h % 12;
    if (hour === 0) hour = 12;
    const ampm = h < 12 ? "AM" : "PM";
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="home-page provider-home-page">
      {/* HERO SECTION */}
      <section className="hero-section provider-hero-section">
        <div className="container">
          <div className="hero-content" data-aos="fade-right">
            <div className="hero-badge">Provider Dashboard Made Simple</div>
            <h1 className="hero-title">
              You control the clock <span className="hero-highlight">not the queue</span>
            </h1>
            <p className="hero-description">
              Welcome! Manage your appointments, availability, and client experience with Fix-Time’s smart queue-free platform.
            </p>
            <div className="hero-buttons">
              <button onClick={() => handleNavigateToTop('/dashboard')} className="btn btn-primary">Go to Dashboard</button>
              <button onClick={() => handleNavigateToTop('/profile')} className="btn btn-secondary">Edit Profile</button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number"><AnimatedCounter value={stats.totalToday} /></span>
                <span className="stat-label">Today’s Appointments</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number"><AnimatedCounter value={stats.noShows} /></span>
                <span className="stat-label">No-Shows</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number"><AnimatedCounter value={stats.avgWait} /> min</span>
                <span className="stat-label">Avg. Wait</span>
              </div>
            </div>
          </div>
          <div className="hero-image" data-aos="fade-left">
            <div className="hero-illustration">
              <img src="https://cdn.jsdelivr.net/gh/priyabratasingh/static-assets/fixtime-hero.svg"
                alt="Provider Dashboard Illustration"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/2693/2693507.png";
                  e.target.style.maxWidth = "80%";
                }}
              />
            </div>
            <div className="blob-shape"></div>
          </div>
        </div>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f8fafc" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* WHY CHOOSE FIXTIME */}
      <section className="why-choose-section">
        <h2 className="why-choose-title" data-aos="fade-up">Why Choose FixTime?</h2>
        <div className="why-fix-time-cards">
          <div className="why-card" data-aos="fade-up" data-aos-delay="0">
            <FaClock className="why-icon" />
            <h4>Queue-Free Scheduling</h4>
            <p>Eliminate waiting lines and fill your calendar with smart, real-time bookings. Let clients book at their convenience and reduce no-shows.</p>
          </div>
          <div className="why-card" data-aos="fade-up" data-aos-delay="100">
            <FaChartBar className="why-icon" />
            <h4>Boost Productivity</h4>
            <p>Automate reminders, manage your slots, and track your performance with insightful analytics—so you can focus on what matters.</p>
          </div>
          <div className="why-card" data-aos="fade-up" data-aos-delay="200">
            <FaUserCheck className="why-icon" />
            <h4>Delight Your Clients</h4>
            <p>Offer a seamless experience with instant confirmations, easy rescheduling, and transparent communication—making every client feel valued.</p>
          </div>
        </div>
      </section>

      {/* EXPLORE YOUR SERVICES */}
      <section className="get-in-touch-section">
        <h2 className="get-in-touch-title" data-aos="fade-up">Get in Touch with Your Business</h2>
        <div className="provider-main-grid container">
          {/* Upcoming Appointments */}
          <div className="provider-card" data-aos="fade-up" data-aos-delay="0">
            <div className="card-header">
              <FaCalendarAlt className="card-icon" />
              <h3>Upcoming Appointments</h3>
              <button onClick={() => handleNavigateToTop('/calendar')} className="view-all-link">View All</button>
            </div>
            <div className="appointments-preview">
              {loadingUpcoming ? (
                <div className="loading-state">Loading...</div>
              ) : errorUpcoming ? (
                <div className="error-message">{errorUpcoming}</div>
              ) : upcoming.length === 0 ? (
                <div className="empty-state">No upcoming appointments.</div>
              ) : (
                upcoming.map(appt => (
                  <div className="appointment-preview" key={appt._id}>
                    <FaUser className="preview-icon" />
                    <div className="preview-info">
                      <div className="client-name">{appt.customerName || appt.clientName}</div>
                      <div className="service-type">{appt.serviceName}</div>
                      <div className="time-slot"><FaClock /> {formatTime12h(appt.time)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Daily Activity Snapshot */}
          <div className="provider-card stats-panel" data-aos="fade-up" data-aos-delay="100">
            <div className="card-header">
              <FaChartBar className="card-icon" />
              <h3>Daily Activity Snapshot</h3>
            </div>
            <div className="stats-counters">
              {loadingStats ? (
                <div className="loading-state">Loading stats...</div>
              ) : errorStats ? (
                <div className="error-message">{errorStats}</div>
              ) : (
                <>
                  <div className="stat-box">
                    <span className="stat-label">Total Today</span>
                    <span className="stat-value"><AnimatedCounter value={stats.totalToday} /></span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">No-Shows</span>
                    <span className="stat-value"><AnimatedCounter value={stats.noShows} /></span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Avg. Duration</span>
                    <span className="stat-value"><AnimatedCounter value={stats.avgWait} /> min</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Manage Availability / Time Slots */}
          <div className="provider-card availability-card" data-aos="fade-up" data-aos-delay="200">
            <div className="card-header">
              <FaCalendarAlt className="card-icon" />
              <h3>Manage Availability</h3>
            </div>
            <div className="availability-content">
              <div className="today-status">Today: <span className={`status-${(() => {
                const today = new Date().toISOString().slice(0, 10);
                const todayBookings = availabilityData.find(d => d.date === today)?.bookings || 0;
                if (todayBookings > 5) return 'busy';
                if (todayBookings > 0) return 'booked';
                return 'free';
              })()}`}>{(() => {
                const today = new Date().toISOString().slice(0, 10);
                const todayBookings = availabilityData.find(d => d.date === today)?.bookings || 0;
                if (todayBookings > 5) return 'Busy';
                if (todayBookings > 0) return 'Booked';
                return 'Free';
              })()}</span></div>
              <button onClick={() => handleNavigateToTop('/dashboard')} className="update-schedule-btn">Update My Schedule</button>
              <MiniCalendar />
            </div>
          </div>

          {/* Real-time Status Control (Queue Management) */}
          <div className="provider-card queue-card" data-aos="fade-up" data-aos-delay="300">
            <div className="card-header">
              <FaToggleOn className="card-icon" />
              <h3>Queue Management</h3>
            </div>
            <div className="queue-status-row">
              <button className={`queue-toggle-btn ${queueOpen ? 'open' : 'closed'}`} onClick={() => setQueueOpen(q => !q)}>
                {queueOpen ? <FaToggleOn /> : <FaToggleOff />} {queueOpen ? 'Queue Open' : 'Queue Closed'}
              </button>
              <div className="now-serving">Now Serving: <span>{nowServing}</span></div>
              <div className="next-appointment">Next: <span>{nextAppointment}</span></div>
            </div>
            <div className="queue-progress-bar">
              <div className="progress" style={{ width: queueOpen ? '70%' : '0%' }}></div>
            </div>
            <div className="queue-under-development">
              <p>Queue Management - Under Development</p>
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="provider-card notifications-card" data-aos="fade-up" data-aos-delay="400">
            <div className="card-header">
              <FaBell className={`card-icon notif-pulse ${notifPulse ? 'pulse' : ''}`} />
              <h3>Notifications</h3>
            </div>
            <ul className="notifications-list">
              {dummyNotifications.map(n => (
                <li key={n.id} className="notification-item">
                  <span className="notif-message">{n.message}</span>
                  <span className="notif-time">{n.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Access Links */}
          <div className="provider-card quick-links-card" data-aos="fade-up" data-aos-delay="500">
            <div className="card-header">
              <FaListAlt className="card-icon" />
              <h3>Quick Access</h3>
            </div>
            <div className="quick-links-grid">
              <button onClick={() => handleNavigateToTop('/profile')} className="quick-link-btn"><FaUserEdit /> Edit Profile</button>
              <button onClick={() => handleNavigateToTop('/provider-services')} className="quick-link-btn"><FaListAlt /> Service Catalogue</button>
              <button onClick={() => handleNavigateToTop('/my-services')} className="quick-link-btn"><FaComments /> My Services</button>
              <button onClick={() => handleNavigateToTop('/help')} className="quick-link-btn"><FaQuestionCircle /> Help Center</button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOUR USERS SAY */}
      <section className="provider-reviews-section">
        <h2 className="reviews-title" data-aos="fade-up">What Your Users Say</h2>
        <div className="provider-reviews-grid">
          {dummyReviews.map(r => <ReviewCard key={r._id} review={r} />)}
        </div>
      </section>
    </div>
  );
};

export default ProviderHomePage; 
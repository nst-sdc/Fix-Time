import React, { useState, useEffect } from 'react';
import './MyServices.css';
import { FaBell, FaCalendarAlt, FaUser, FaStar, FaEdit, FaTrash, FaPlus, FaChartPie, FaChartBar, FaEnvelope, FaFlag, FaUsers, FaClock, FaToggleOn, FaToggleOff, FaUserCircle, FaMapMarkerAlt, FaTags, FaPhone, FaImage, FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import ServiceForm from '../components/ServiceForm';
import ReactDOM from 'react-dom';

// --- Mock Data ---
const mockBookings = [
  { id: 1, name: 'Alice Smith', date: '2024-07-15', time: '10:00', service: 'Haircut', status: 'Confirmed' },
  { id: 2, name: 'Bob Lee', date: '2024-07-15', time: '12:00', service: 'Yoga', status: 'Pending' },
  { id: 3, name: 'Charlie Kim', date: '2024-07-14', time: '09:00', service: 'Car Wash', status: 'No-show' },
  { id: 4, name: 'Dana White', date: '2024-07-13', time: '15:00', service: 'Haircut', status: 'Cancelled' },
];
const mockServices = [
  { id: 1, name: 'Haircut', duration: 30, cost: 25, status: true, category: 'Salon', buffer: 10 },
  { id: 2, name: 'Yoga', duration: 60, cost: 15, status: true, category: 'Fitness', buffer: 5 },
  { id: 3, name: 'Car Wash', duration: 45, cost: 20, status: false, category: 'Automobile', buffer: 15 },
];
const mockNotifications = [
  { id: 1, type: 'booking', text: 'New booking from Alice Smith', unread: true },
  { id: 2, type: 'cancel', text: 'Booking cancelled by Dana White', unread: true },
  { id: 3, type: 'feedback', text: 'New feedback from Bob Lee', unread: false },
  { id: 4, type: 'system', text: 'System maintenance on July 20', unread: true },
];
const mockAnalytics = {
  weeklyBookings: 18,
  monthlyBookings: 72,
  revenue: 1200,
  mostBooked: 'Haircut',
  repeatCustomers: 8,
  pie: [
    { label: 'Haircut', value: 40, color: '#6C8AE4' },
    { label: 'Yoga', value: 25, color: '#A3B8D8' },
    { label: 'Car Wash', value: 35, color: '#BFD7ED' },
  ],
  bar: [
    { label: 'Week 1', value: 15, details: { Haircut: 7, Yoga: 4, 'Car Wash': 4 } },
    { label: 'Week 2', value: 18, details: { Haircut: 6, Yoga: 7, 'Car Wash': 5 } },
    { label: 'Week 3', value: 20, details: { Haircut: 8, Yoga: 6, 'Car Wash': 6 } },
    { label: 'Week 4', value: 19, details: { Haircut: 7, Yoga: 5, 'Car Wash': 7 } },
  ],
};
const mockReviews = [
  { id: 1, service: 'Haircut', name: 'Alice Smith', rating: 5, text: 'Great service!', date: '2024-07-10' },
  { id: 2, service: 'Yoga', name: 'Bob Lee', rating: 4, text: 'Very relaxing.', date: '2024-07-09' },
  { id: 3, service: 'Car Wash', name: 'Charlie Kim', rating: 3, text: 'Good, but a bit slow.', date: '2024-07-08' },
];
const mockProfile = {
  name: 'Naman’s Salon',
  logo: '',
  description: 'Professional salon and wellness services.',
  address: '123 Main St, City',
  tags: ['Salon', 'Wellness', 'Haircut'],
  contact: '+1 234 567 890',
};

// --- Section 1: Booking Dashboard ---
function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Upcoming');
  const [actionLoading, setActionLoading] = useState({});
  const filters = ['Upcoming', 'Today', 'Scheduled', 'Past', 'Cancelled'];

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/appointments/provider', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.appointments || []);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, action) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    let newStatus = '';
    if (action === 'confirm') newStatus = 'scheduled';
    if (action === 'reject') newStatus = 'cancelled';
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5001/appointments/${id}/provider-status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Helper to check if appointment is in the future
  function isFutureAppointment(dateStr, timeStr) {
    if (!dateStr || !timeStr) return false;
    // Support both '10:00' and '10:00 AM' formats
    let hours = 0, minutes = 0;
    let t = timeStr.trim();
    let ampm = '';
    if (/am|pm|AM|PM/.test(t)) {
      // 12-hour format
      const [time, meridian] = t.split(/\s+/);
      [hours, minutes] = time.split(":").map(Number);
      ampm = meridian.toUpperCase();
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    } else {
      // 24-hour format
      [hours, minutes] = t.split(":").map(Number);
    }
    const apptDate = new Date(dateStr);
    apptDate.setHours(hours);
    apptDate.setMinutes(minutes);
    apptDate.setSeconds(0);
    return apptDate > new Date();
  }

  // Filtering logic
  const todayStr = new Date().toISOString().slice(0, 10);
  const filtered = bookings.filter(b => {
    if (filter === 'Upcoming') return isFutureAppointment(b.date, b.time);
    if (filter === 'Today') return b.date && b.date.slice(0, 10) === todayStr;
    if (filter === 'Scheduled') return b.status === 'scheduled';
    if (filter === 'Past') return b.status === 'completed' || b.status === 'no-show';
    if (filter === 'Cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

  // Calendar days with bookings
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <section className="section booking-dashboard">
      <h2>Booking Dashboard</h2>
      <div className="booking-filters">
        {filters.map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      {loading ? (
        <div className="loading-state">Loading bookings...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No Bookings</h3>
          <p>You have no bookings in this category.</p>
        </div>
      ) : (
        <div className="booking-cards">
          {filtered.map(b => (
            <div className={`booking-card status-${b.status?.toLowerCase()}`} key={b._id}>
              <div className="booking-card-header">
                <span className="booking-name">{b.customerName || b.customerEmail}</span>
                <span className={`booking-status ${
                  b.status === 'scheduled' ? 'scheduled-blue' :
                  b.status === 'cancelled' ? 'cancelled-red' :
                  b.status?.toLowerCase()
                }`}>
                  {b.status === 'scheduled' ? 'Scheduled' :
                   b.status === 'cancelled' ? 'Cancelled' :
                   b.status}
                </span>
              </div>
              <div className="booking-card-body">
                <span>{b.serviceName}</span>
                <span>{b.date?.slice(0, 10)} {b.time}</span>
              </div>
              <div className="booking-card-actions">
                {b.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(b._id, 'confirm')}
                      disabled={!!actionLoading[b._id]}
                      className="confirm-btn"
                    >
                      {actionLoading[b._id] ? 'Confirming...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(b._id, 'reject')}
                      disabled={!!actionLoading[b._id]}
                      className="reject-btn"
                    >
                      {actionLoading[b._id] ? 'Rejecting...' : 'Reject'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="calendar-mini">
        <FaCalendarAlt className="calendar-icon" />
        <div className="calendar-days">
          {days.map((d, i) => (
            <div key={i} className={`calendar-day${bookings.some(b => b.date && b.date.slice(0,10) === d.toISOString().slice(0,10)) ? ' booked' : ''}`}>
              {d.getDate()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Section 2: Service Management Panel ---
function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/services/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setServices(response.data.services);
        } else {
          setError('Failed to fetch your services');
        }
      } catch (err) {
        setError('Failed to load your services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [refresh]);

  // Unique categories for filter
  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];

  // Filtered services
  const filtered = services.filter(s =>
    (category === 'all' || s.category === category) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleAdd = () => {
    setEditService(null);
    setShowForm(true);
  };
  const handleEdit = (service) => {
    setEditService(service);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to delete service.');
    }
  };
  const handleToggle = async (service) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5001/services/${service._id}`, {
        isActive: !service.isActive
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to update service status.');
    }
  };
  const handleFormClose = () => {
    setShowForm(false);
    setEditService(null);
    setRefresh(r => r + 1);
  };

  return (
    <section className="section service-management">
      <h2>Service Management</h2>
      <div className="service-filters">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="service-search"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="service-category-filter">
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="loading-state">Loading your services...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="no-services-message">You haven’t added any services yet.</div>
      ) : (
        <div className="service-list">
          {filtered.map(service => (
            <div className={`service-item${service.isActive ? '' : ' inactive'}`} key={service._id}>
              <div className="service-info">
                <span className="service-name">{service.name}</span>
                <span className="service-meta">{service.duration} min | ₹{service.price} | {service.category}</span>
                <span className="service-buffer">{service.timeSlots?.length ? `Slots: ${service.timeSlots.length}` : ''}</span>
              </div>
              <div className="service-actions">
                <button onClick={() => handleToggle(service)}>{service.isActive ? <FaToggleOn /> : <FaToggleOff />}</button>
                <button onClick={() => handleEdit(service)}><FaEdit /></button>
                <button onClick={() => handleDelete(service._id)}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="add-btn" onClick={handleAdd}><FaPlus /> Add New Service</button>
      {showForm && ReactDOM.createPortal(
        <ServiceForm
          service={editService}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />,
        document.body
      )}
    </section>
  );
}

// --- Section 4: Notifications Panel ---
function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const unread = mockNotifications.filter(n => n.unread).length;
  return (
    <div className="notifications-panel">
      <button
        className={`bell-btn${open ? ' active' : ''}`}
        onClick={() => setOpen(true)}
        title="Notifications"
        aria-label="Show notifications"
      >
        <FaBell />
        {unread > 0 && <span className="notif-count">{unread}</span>}
      </button>
      {open && (
        <div className="notif-modal-overlay" onClick={() => setOpen(false)}>
          <div className="notif-modal-grid" onClick={e => e.stopPropagation()}>
            <button className="notif-close-btn" onClick={() => setOpen(false)} aria-label="Close notifications">&times;</button>
            <h3>Notifications</h3>
            <div className="notif-grid">
              {mockNotifications.length === 0 ? (
                <div className="notif-empty">No notifications</div>
              ) : (
                mockNotifications.map(n => (
                  <div key={n.id} className={`notif-item${n.unread ? ' unread' : ''}`}>{n.text}</div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Section 5: Analytics & Insights ---
function AnalyticsInsights() {
  // Prepare data for service-wise and week-wise charts
  const services = mockAnalytics.pie.map(s => s.label);
  const weeks = mockAnalytics.bar.map(b => b.label);
  // Service-wise: for each service, array of bookings per week
  const serviceData = services.map(service =>
    mockAnalytics.bar.map(week => week.details[service] || 0)
  );
  // Week-wise: for each week, array of bookings per service
  const weekData = mockAnalytics.bar.map(week =>
    services.map(service => week.details[service] || 0)
  );
  const serviceColors = mockAnalytics.pie.map(s => s.color);

  // Donut chart SVG
  function DonutChart({ data }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;
    const radius = 38, cx = 45, cy = 45, stroke = 16;
    return (
      <svg width="90" height="90" viewBox="0 0 90 90">
        {data.map((d, i) => {
          const val = d.value / total;
          const start = cumulative;
          cumulative += val;
          const x1 = cx + radius * Math.cos(2 * Math.PI * start - Math.PI / 2);
          const y1 = cy + radius * Math.sin(2 * Math.PI * start - Math.PI / 2);
          const x2 = cx + radius * Math.cos(2 * Math.PI * cumulative - Math.PI / 2);
          const y2 = cy + radius * Math.sin(2 * Math.PI * cumulative - Math.PI / 2);
          const largeArc = val > 0.5 ? 1 : 0;
          const pathData = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
          return <path key={i} d={pathData} fill={d.color} opacity="0.9" />;
        })}
      </svg>
    );
  }

  // Bar chart SVG
  function BarChart({ data, labels, colors }) {
    const max = Math.max(...data);
    return (
      <svg width="120" height="70" viewBox="0 0 120 70">
        {data.map((v, i) => (
          <rect key={i} x={i * 35 + 10} y={70 - (v / max) * 60} width="18" height={(v / max) * 60} fill={colors[i]} rx="4" />
        ))}
      </svg>
    );
  }

  return (
    <section className="section analytics-insights analytics-blur">
      <div className="analytics-header-row">
        <h2>Analytics & Insights</h2>
        <span className="coming-soon-note-highlight">(Coming soon)</span>
      </div>
      <div className="analytics-cards">
        <div className="analytics-item">
          <span>Total Bookings (Month)</span>
          <strong>{mockAnalytics.monthlyBookings}</strong>
        </div>
        <div className="analytics-item">
          <span>Total Revenue</span>
          <strong>${mockAnalytics.revenue}</strong>
        </div>
        <div className="analytics-item">
          <span>Most Booked</span>
          <strong>{mockAnalytics.mostBooked}</strong>
        </div>
        <div className="analytics-item">
          <span>Repeat Customers</span>
          <strong>{mockAnalytics.repeatCustomers}</strong>
        </div>
        <div className="analytics-item">
          <span>Avg. Booking Value</span>
          <strong>${(mockAnalytics.revenue / mockAnalytics.monthlyBookings).toFixed(2)}</strong>
        </div>
        <div className="analytics-item">
          <span>New Customers</span>
          <strong>12</strong>
        </div>
        <div className="analytics-item">
          <span>Top Service</span>
          <strong>Haircut</strong>
        </div>
      </div>
      <div className="charts-row">
        <div className="donut-chart">
          <div className="chart-title">Service Distribution</div>
          <DonutChart data={mockAnalytics.pie} />
          <div className="pie-legend">
            {mockAnalytics.pie.map((s, i) => (
              <span key={i} style={{ color: s.color }}>{s.label}</span>
            ))}
          </div>
        </div>
        <div className="line-chart">
          <div className="chart-title">Bookings by Week</div>
          <BarChart data={mockAnalytics.bar.map(b => b.value)} labels={mockAnalytics.bar.map(b => b.label)} colors={serviceColors} />
          <div className="bar-legend">
            {mockAnalytics.bar.map((b, i) => (
              <span key={i}>{b.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Section 7: Ratings & Feedback ---
function RatingsFeedback() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        // 1. Fetch all provider services
        const servicesRes = await axios.get('http://localhost:5001/services/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!servicesRes.data.success || !servicesRes.data.services) {
          setError('Failed to fetch your services.');
          setLoading(false);
          return;
        }
        const services = servicesRes.data.services;
        // 2. Fetch reviews for each service
        const allReviews = [];
        for (const service of services) {
          try {
            const reviewsRes = await axios.get(`http://localhost:5001/reviews/service/${service._id}`);
            if (reviewsRes.data.success && Array.isArray(reviewsRes.data.data)) {
              reviewsRes.data.data.forEach(r => allReviews.push({ ...r, serviceName: service.name }));
            }
          } catch (err) {
            // Ignore errors for individual services
          }
        }
        setReviews(allReviews);
      } catch (err) {
        setError('Failed to load ratings and feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, []);

  return (
    <section className="section ratings-feedback">
      <h2>Ratings & Feedback</h2>
      {loading ? (
        <div className="loading-state">Loading ratings and feedback...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">No ratings or feedback yet.</div>
      ) : (
        <div className="reviews-list">
          {reviews.map((r, idx) => (
            <div className="review-item" key={r._id || idx}>
              <div className="review-header">
                <span className="review-name">{r.userId?.email?.split('@')[0] || 'Anonymous'}</span>
                <span className="review-service">({r.serviceName})</span>
                <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => <FaStar key={i} className={i < r.rating ? 'star filled' : 'star'} />)}
              </div>
              <div className="review-text">{r.comment}</div>
              <div className="review-actions">
                <button className="review-btn"><FaEdit /> Respond</button>
                <button className="review-btn"><FaFlag /> Report</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// --- Section 8: Manage Team Members ---
function ManageTeamMembers() {
  // Placeholder for team management UI
  return (
    <section className="section manage-team-members">
      <h2>Manage Team Members</h2>
      <div style={{color:'#64748b',fontSize:'1.08rem',marginTop:'1.2rem'}}>Team management features coming soon.</div>
    </section>
  );
}
// --- Main Page Layout ---
export default function MyServices() {
  return (
    <div className="myservices-main">
      <div className="dashboard-grid">
        <NotificationsPanel />
        <BookingDashboard />
        <ServiceManagement />
        <AnalyticsInsights />
        <RatingsFeedback />
        <ManageTeamMembers />
      </div>
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import './MyServices.css';
import { FaBell, FaCalendarAlt, FaUser, FaStar, FaEdit, FaTrash, FaPlus, FaChartPie, FaChartBar, FaEnvelope, FaFlag, FaUsers, FaClock, FaToggleOn, FaToggleOff } from 'react-icons/fa';
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
    { label: 'Week 1', value: 15 },
    { label: 'Week 2', value: 18 },
    { label: 'Week 3', value: 20 },
    { label: 'Week 4', value: 19 },
  ],
};
const mockCustomers = [
  { id: 1, name: 'Alice Smith', contact: 'alice@email.com', history: 5 },
  { id: 2, name: 'Bob Lee', contact: 'bob@email.com', history: 3 },
  { id: 3, name: 'Charlie Kim', contact: 'charlie@email.com', history: 2 },
];
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
const mockCoupons = [
  { id: 1, name: 'SUMMER10', amount: 10, type: '%', expiry: '2024-08-01', used: 5 },
  { id: 2, name: 'WELCOME5', amount: 5, type: '$', expiry: '2024-12-31', used: 12 },
];
const mockTeam = [
  { id: 1, name: 'Priya', role: 'Stylist', services: ['Haircut'], performance: 4.8 },
  { id: 2, name: 'Rahul', role: 'Yoga Trainer', services: ['Yoga'], performance: 4.6 },
];

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

// --- Section 3: Availability & Schedule Settings ---
function AvailabilitySettings() {
  const [availability, setAvailability] = useState({
    Mon: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Tue: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Wed: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Thu: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Fri: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Sat: { enabled: false, slots: [] },
    Sun: { enabled: false, slots: [] },
  });
  const [holidays, setHolidays] = useState(['2024-07-20']);
  const [breaks, setBreaks] = useState(['12:00-13:00']);
  const days = Object.keys(availability);
  const toggleDay = d => setAvailability({ ...availability, [d]: { ...availability[d], enabled: !availability[d].enabled } });
  return (
    <section className="section availability-settings">
      <h2>Availability & Schedule</h2>
      <div className="availability-days">
        {days.map(d => (
          <div key={d} className={`day-row${availability[d].enabled ? '' : ' off'}`}>
            <span>{d}</span>
            <button onClick={() => toggleDay(d)}>{availability[d].enabled ? <FaToggleOn /> : <FaToggleOff />}</button>
            <span className="slots">{availability[d].slots.join(', ')}</span>
          </div>
        ))}
      </div>
      <div className="availability-extras">
        <div>
          <strong>Holidays:</strong> {holidays.join(', ')}
        </div>
        <div>
          <strong>Breaks:</strong> {breaks.join(', ')}
        </div>
      </div>
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
  return (
    <section className="section analytics-insights">
      <h2>Analytics & Insights</h2>
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
      </div>
      <div className="charts-row">
        <div className="pie-chart">
          <svg width="120" height="120" viewBox="0 0 32 32">
            {(() => {
              let acc = 0;
              return mockAnalytics.pie.map((slice, i) => {
                const val = slice.value / 100 * 100;
                const dash = `${val} ${100 - val}`;
                const el = <circle key={i} r="16" cx="16" cy="16" fill="transparent" stroke={slice.color} strokeWidth="8" strokeDasharray={dash} strokeDashoffset={-acc} />;
                acc -= val;
                return el;
              });
            })()}
          </svg>
          <div className="pie-legend">
            {mockAnalytics.pie.map((slice, i) => (
              <span key={i} style={{ color: slice.color }}>{slice.label}</span>
            ))}
          </div>
        </div>
        <div className="bar-chart">
          <svg width="120" height="80">
            {mockAnalytics.bar.map((bar, i) => (
              <rect key={i} x={i*25+10} y={80-bar.value*3} width="18" height={bar.value*3} fill="#6C8AE4" rx="4" />
            ))}
          </svg>
          <div className="bar-legend">
            {mockAnalytics.bar.map((bar, i) => (
              <span key={i}>{bar.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Section 6: Customer Management ---
function CustomerManagement() {
  return (
    <section className="section customer-management">
      <h2>Customer Management</h2>
      <div className="customer-list">
        {mockCustomers.map(c => (
          <div className="customer-item" key={c.id}>
            <div className="customer-info">
              <span className="customer-name">{c.name}</span>
              <span className="customer-contact">{c.contact}</span>
              <span className="customer-history">Past bookings: {c.history}</span>
            </div>
            <div className="customer-actions">
              <button><FaEnvelope /></button>
              <button><FaEdit /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Section 7: Ratings & Feedback ---
function RatingsFeedback() {
  return (
    <section className="section ratings-feedback">
      <h2>Ratings & Feedback</h2>
      <div className="reviews-list">
        {mockReviews.map(r => (
          <div className="review-item" key={r.id}>
            <div className="review-header">
              <span className="review-name">{r.name}</span>
              <span className="review-service">({r.service})</span>
              <span className="review-date">{r.date}</span>
            </div>
            <div className="review-rating">
              {[...Array(5)].map((_, i) => <FaStar key={i} className={i < r.rating ? 'star filled' : 'star'} />)}
            </div>
            <div className="review-text">{r.text}</div>
            <div className="review-actions">
              <button><FaEdit /> Respond</button>
              <button><FaFlag /> Report</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Section 8: Profile Customization ---
function ProfileCustomization() {
  const [profile, setProfile] = useState(mockProfile);
  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });
  return (
    <section className="section profile-customization">
      <h2>Profile Customization</h2>
      <form className="profile-form">
        <div className="profile-row">
          <label>Business Name</label>
          <input name="name" value={profile.name} onChange={handleChange} />
        </div>
        <div className="profile-row">
          <label>Logo</label>
          <input type="file" accept="image/*" />
        </div>
        <div className="profile-row">
          <label>Description</label>
          <textarea name="description" value={profile.description} onChange={handleChange} />
        </div>
        <div className="profile-row">
          <label>Location</label>
          <input name="address" value={profile.address} onChange={handleChange} />
        </div>
        <div className="profile-row">
          <label>Tags</label>
          <input name="tags" value={profile.tags.join(', ')} onChange={e => setProfile({ ...profile, tags: e.target.value.split(',').map(t => t.trim()) })} />
        </div>
        <div className="profile-row">
          <label>Contact Info</label>
          <input name="contact" value={profile.contact} onChange={handleChange} />
        </div>
      </form>
    </section>
  );
}

// --- Section 9: Promotions & Coupons ---
function PromotionsCoupons() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [form, setForm] = useState({ name: '', amount: '', type: '%', expiry: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = e => {
    e.preventDefault();
    setCoupons([...coupons, { ...form, id: Date.now(), used: 0 }]);
    setForm({ name: '', amount: '', type: '%', expiry: '' });
  };
  return (
    <section className="section promotions-coupons">
      <h2>Promotions & Coupons</h2>
      <div className="coupons-list">
        {coupons.map(c => (
          <div className="coupon-item" key={c.id}>
            <span className="coupon-name">{c.name}</span>
            <span className="coupon-amount">{c.amount}{c.type}</span>
            <span className="coupon-expiry">Exp: {c.expiry}</span>
            <span className="coupon-used">Used: {c.used}</span>
            <button onClick={() => {}}><FaEdit /></button>
            <button onClick={() => setCoupons(coupons.filter(x => x.id !== c.id))}><FaTrash /></button>
          </div>
        ))}
      </div>
      <form className="coupon-form" onSubmit={handleAdd}>
        <input name="name" placeholder="Coupon Name" value={form.name} onChange={handleChange} required />
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="%">%</option>
          <option value="$">$</option>
        </select>
        <input name="expiry" placeholder="Expiry (YYYY-MM-DD)" value={form.expiry} onChange={handleChange} required />
        <button type="submit"><FaPlus /> Add Coupon</button>
      </form>
    </section>
  );
}

// --- Section 10: Team Access ---
function TeamAccess() {
  const [team, setTeam] = useState(mockTeam);
  const [form, setForm] = useState({ name: '', role: '', services: '', performance: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = e => {
    e.preventDefault();
    setTeam([...team, { ...form, id: Date.now(), services: form.services.split(',').map(s => s.trim()) }]);
    setForm({ name: '', role: '', services: '', performance: '' });
  };
  return (
    <section className="section team-access">
      <h2>Team Access</h2>
      <div className="team-list">
        {team.map(m => (
          <div className="team-item" key={m.id}>
            <div className="team-info">
              <span className="team-name">{m.name}</span>
              <span className="team-role">{m.role}</span>
              <span className="team-services">{m.services.join(', ')}</span>
              <span className="team-performance">Performance: {m.performance}</span>
            </div>
            <button onClick={() => {}}><FaEdit /></button>
            <button onClick={() => setTeam(team.filter(x => x.id !== m.id))}><FaTrash /></button>
          </div>
        ))}
      </div>
      <form className="team-form" onSubmit={handleAdd}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
        <input name="services" placeholder="Services (comma separated)" value={form.services} onChange={handleChange} required />
        <input name="performance" placeholder="Performance" value={form.performance} onChange={handleChange} required />
        <button type="submit"><FaPlus /> Add Member</button>
      </form>
    </section>
  );
}

// --- Main Page Layout ---
export default function MyServices() {
  return (
    <div className="myservices-main">
      <NotificationsPanel />
      <div className="dashboard-grid">
        <BookingDashboard />
        <ServiceManagement />
        <AvailabilitySettings />
        <AnalyticsInsights />
        <CustomerManagement />
        <RatingsFeedback />
        <ProfileCustomization />
        <PromotionsCoupons />
        <TeamAccess />
      </div>
    </div>
  );
} 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyAppointments.css';
import './Services.css';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editService, setEditService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAppointments, setShowAppointments] = useState(null);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/services/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data.services || []);
      setError('');
    } catch (err) {
      setError('Failed to load your services.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (service) => {
    setEditService(service._id);
    setEditForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      available: service.available,
      location: service.location,
      totalSlots: service.totalSlots || '',
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/services/${editService}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditService(null);
      fetchMyServices();
    } catch (err) {
      alert('Failed to update service.');
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyServices();
    } catch (err) {
      alert('Failed to delete service.');
    }
  };

  if (loading) return <div className="appointments-container"><div className="loading-spinner">Loading your services...</div></div>;

  return (
    <div className="appointments-container">
      <div className="appointments-card">
        <h1 className="page-title">My Services</h1>
        {error && <div className="error-message">{error}</div>}
        {services.length === 0 ? (
          <div className="empty-state">
            <h3>You haven't added any services yet.</h3>
            <p>Add a service to start managing your offerings.</p>
          </div>
        ) : (
          <div className="appointments-grid">
            {services.map(service => (
              <div className="appointment-card" key={service._id}>
                {editService === service._id ? (
                  <form onSubmit={handleEditSubmit} className="edit-service-form">
                    <input name="name" value={editForm.name} onChange={handleEditChange} required />
                    <textarea name="description" value={editForm.description} onChange={handleEditChange} required />
                    <input name="price" type="number" value={editForm.price} onChange={handleEditChange} required />
                    <input name="duration" type="number" value={editForm.duration} onChange={handleEditChange} required />
                    <input name="location" value={editForm.location} onChange={handleEditChange} />
                    <select name="available" value={editForm.available} onChange={handleEditChange}>
                      <option value={true}>Available</option>
                      <option value={false}>Unavailable</option>
                    </select>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditService(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <p><strong>Price:</strong> ₹{service.price}</p>
                    <p><strong>Duration:</strong> {service.duration} min</p>
                    <p><strong>Location:</strong> {service.location}</p>
                    <p><strong>Status:</strong> {service.available ? 'Available' : 'Unavailable'}</p>
                    {service.bookedByMe && (
                      <span className="badge badge-success">You have booked this service</span>
                    )}
                    <div className="appointment-actions">
                      <button onClick={() => handleEditClick(service)}>Edit</button>
                      <button onClick={() => handleDelete(service._id)}>Delete</button>
                      <button onClick={() => setShowAppointments(showAppointments === service._id ? null : service._id)}>
                        {showAppointments === service._id ? 'Hide' : 'View'} Appointments
                      </button>
                    </div>
                    {showAppointments === service._id && (
                      <div className="service-appointments">
                        <h4>Appointments</h4>
                        {service.appointments.length === 0 ? (
                          <p>No appointments for this service yet.</p>
                        ) : (
                          <ul>
                            {service.appointments.map(appt => (
                              <li key={appt._id}>
                                <strong>{appt.customerName}</strong> ({appt.customerEmail}, {appt.customerPhone})<br />
                                {new Date(appt.date).toLocaleString()} - {appt.status}
                              </li>
                            ))}
                          </ul>
                        )}
                        {service.myAppointments && service.myAppointments.length > 0 && (
                          <div className="my-appointments-section">
                            <h5>Your Bookings for this Service</h5>
                            <ul>
                              {service.myAppointments.map(appt => (
                                <li key={appt._id} style={{ color: '#372a72', fontWeight: 'bold' }}>
                                  <strong>{appt.customerName}</strong> ({appt.customerEmail}, {appt.customerPhone})<br />
                                  {new Date(appt.date).toLocaleString()} - {appt.status}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices; 
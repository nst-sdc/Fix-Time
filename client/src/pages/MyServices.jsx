import React, { useState } from 'react';
import './MyServices.css';
import { FaEye, FaEdit, FaTrash, FaList, FaFilter, FaSort } from 'react-icons/fa';

// Mock data for demonstration
const mockServices = [
  {
    id: 1,
    name: 'Haircut & Styling',
    category: 'Salon',
    bookings: 12,
    description: 'Professional haircut and styling for all hair types.',
  },
  {
    id: 2,
    name: 'Yoga Class',
    category: 'Fitness',
    bookings: 8,
    description: 'Group yoga sessions for all levels.',
  },
  {
    id: 3,
    name: 'Car Wash',
    category: 'Automobile',
    bookings: 5,
    description: 'Exterior and interior car cleaning service.',
  },
];

const categories = ['All', ...Array.from(new Set(mockServices.map(s => s.category)))];

const MyServices = () => {
  const [services, setServices] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedService, setSelectedService] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Stats
  const totalServices = services.length;
  const totalBookings = services.reduce((sum, s) => sum + s.bookings, 0);

  // Filter, search, sort
  const filteredServices = services
    .filter(s => filterCategory === 'All' || s.category === filterCategory)
    .filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'bookings') return b.bookings - a.bookings;
      return 0;
    });

  // Modal handlers
  const openDetails = (service) => {
    setSelectedService(service);
    setShowDetails(true);
  };
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedService(null);
  };

  // Delete with confirmation
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(s => s.id !== id));
      closeDetails();
    }
  };

  return (
    <div className="my-services-container">
      <div className="my-services-card">
        <div className="my-services-header">
          <div className="header-content">
            <h1 className="page-title">My Services</h1>
            <p className="page-subtitle">Manage and track all your offered services</p>
          </div>
          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-number">{totalServices}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalBookings}</span>
              <span className="stat-label">Bookings</span>
            </div>
          </div>
          <button className="add-service-btn">+ Add New Service</button>
        </div>

        <div className="controls-section">
          <div className="search-section">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                style={{ display: searchTerm ? 'block' : 'none' }}
              >
                ×
              </button>
            </div>
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="sort-group">
              <FaSort className="sort-icon" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="bookings">Sort by Bookings</option>
              </select>
            </div>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaList />
            </div>
            <h3>No services found</h3>
            <p>
              {services.length === 0
                ? "You don't have any services yet. Add your first service to get started!"
                : `No services match your search or filter.`}
            </p>
            <button className="add-service-btn">+ Add New Service</button>
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map(service => (
              <div
                className="service-card-provider"
                key={service.id}
                onClick={() => openDetails(service)}
              >
                <div className="service-card-header">
                  <h2>{service.name}</h2>
                  <span className="service-category">{service.category}</span>
                </div>
                <p className="service-description">{service.description}</p>
                <div className="service-card-footer">
                  <span className="service-bookings">Bookings: {service.bookings}</span>
                  <div className="service-actions">
                    <button className="view-details-btn">
                      <FaEye /> View Details
                    </button>
                    <button className="edit-btn" onClick={e => { e.stopPropagation(); /* handle edit */ }}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(service.id); }}>
                      <FaTrash /> Delete
                    </button>
                    <button className="view-bookings-btn" onClick={e => { e.stopPropagation(); /* handle view bookings */ }}>
                      <FaList /> View Bookings
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Details Modal */}
      {showDetails && selectedService && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedService.name}</h2>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Service Details</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{selectedService.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Bookings:</span>
                    <span className="detail-value">{selectedService.bookings}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{selectedService.description}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="edit-btn" onClick={() => {/* handle edit */}}>
                <FaEdit /> Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(selectedService.id)}>
                <FaTrash /> Delete
              </button>
              <button className="view-bookings-btn" onClick={() => {/* handle view bookings */}}>
                <FaList /> View Bookings
              </button>
              <button className="close-modal-btn" onClick={closeDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyServices; 
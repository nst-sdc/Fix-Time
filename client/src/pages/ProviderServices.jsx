import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './categories/CategoryPage.css';
import ServiceCard from '../components/ServiceCard';
import ReactDOM from 'react-dom';
import { FaUserMd, FaCut, FaTools, FaGraduationCap, FaBalanceScale, FaCar, FaShoppingBag, FaGlassCheers, FaHotel, FaEllipsisH, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle } from 'react-icons/fa';
import ServiceForm from '../components/ServiceForm';

const CATEGORY_ICONS = {
  'Healthcare & Wellness': <FaUserMd />,
  'Beauty & Personal Care': <FaCut />,
  'Home & Repair Services': <FaTools />,
  'Education & Coaching': <FaGraduationCap />,
  'Government / Legal Services': <FaBalanceScale />,
  'Automobile Services': <FaCar />,
  'Retail & Local Businesses': <FaShoppingBag />,
  'Private Events': <FaGlassCheers />,
  'Hotel & Restaurant': <FaHotel />,
  'Others': <FaEllipsisH />
};

const ProviderServices = ({ userProfile }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalService, setModalService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchProviderServices = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/services/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setServices(response.data.services);
          const cats = [...new Set(response.data.services.map(s => s.category))];
          setCategories(cats);
        } else {
          setError('Failed to fetch your services');
        }
      } catch (err) {
        setError('Failed to load your services');
      } finally {
        setLoading(false);
      }
    };
    fetchProviderServices();
  }, [refresh]);

  const filteredServices = selectedCategory
    ? services.filter(s => s.category === selectedCategory)
    : [];

  const handleKnowMore = (service) => {
    setModalService(service);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditService(service);
    setShowEditModal(true);
  };
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditService(null);
    setRefresh(r => r + 1);
  };
  const handleDelete = async (service) => {
    if (!window.confirm(`Are you sure you want to delete the service "${service.name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/services/${service._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to delete service.');
    }
  };

  return (
    <div className="category-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)', paddingBottom: 40 }}>
      <h1 className="category-title" style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '2.2rem', letterSpacing: '-0.02em' }}>Service Catalog</h1>
      <div style={{ textAlign: 'center', marginBottom: '2.2rem', color: '#64748b', fontSize: '1.18rem', fontWeight: 500, letterSpacing: '0.01em' }}>
        Browse your services by category
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-state">Loading your services...</div>
      ) : (
        <>
          {!selectedCategory ? (
            <div className="services-list">
              {categories.length === 0 ? (
                <div className="no-services-message">You haven't added any services yet.</div>
              ) : (
                categories.map((cat, idx) => (
                  <div
                    key={cat}
                    className="service-card"
                    style={{ cursor: 'pointer', animationDelay: `${0.1 + idx * 0.07}s`, minHeight: 120, display: 'flex', alignItems: 'center', padding: '2.1rem 1.5rem', fontSize: '1.18rem', fontWeight: 700, letterSpacing: '0.01em' }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className="service-icon" style={{ fontSize: '2.1rem', marginRight: 22 }}>
                      {CATEGORY_ICONS[cat] || <FaEllipsisH />}
                    </div>
                    <div className="service-details">
                      <div className="service-name" style={{ fontSize: '1.22rem', fontWeight: 700 }}>{cat}</div>
                      <div style={{ color: '#64748b', fontSize: '1.01rem', fontWeight: 500 }}>
                        {services.filter(s => s.category === cat).length} service(s)
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              <button
                style={{ marginBottom: 20, background: 'none', border: 'none', color: '#f97316', fontWeight: 700, cursor: 'pointer', fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => setSelectedCategory(null)}
              >
                <span style={{ fontSize: '1.2rem', marginRight: 2 }}>←</span> Back to Categories
              </button>
              <h2 className="category-title" style={{ fontSize: '2rem', marginBottom: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>{CATEGORY_ICONS[selectedCategory]} {selectedCategory}</h2>
              <div className="services-list">
                {filteredServices.length === 0 ? (
                  <div className="no-services-message">No services in this category yet.</div>
                ) : (
                  filteredServices.map((service, idx) => (
                    <div key={service._id} className="service-card" style={{ animationDelay: `${0.1 + idx * 0.07}s`, minHeight: 120, display: 'flex', alignItems: 'center', padding: '2.1rem 1.5rem', fontSize: '1.13rem', fontWeight: 600, letterSpacing: '0.01em', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div className="service-icon" style={{ fontSize: '1.7rem', marginRight: 18 }}>
                          {CATEGORY_ICONS[service.category] || <FaEllipsisH />}
                        </div>
                        <div className="service-details">
                          <div className="service-name" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{service.name}</div>
                          <div style={{ color: '#64748b', fontSize: '0.99rem', fontWeight: 500 }}>₹{service.price} • {service.duration} min</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="edit-btn" style={{ background: '#f3e8ff', color: '#7c3aed', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', padding: '0.5rem 1.1rem', cursor: 'pointer' }} onClick={() => handleEdit(service)}>Edit</button>
                        <button className="delete-btn" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', padding: '0.5rem 1.1rem', cursor: 'pointer' }} onClick={() => handleDelete(service)}>Delete</button>
                        <button className="know-more-btn" style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', padding: '0.6rem 1.3rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(249,115,22,0.10)', marginLeft: 0 }} onClick={() => handleKnowMore(service)}>Know More</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}
      {/* Know More Modal */}
      {showModal && modalService && ReactDOM.createPortal(
        <div className="service-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="service-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 10 }}>{modalService.name}</h2>
            {modalService.imageUrl && (
              <img src={modalService.imageUrl} alt={modalService.name} className="service-modal-img" style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 18 }} />
            )}
            <div style={{ marginBottom: 10, color: '#64748b', fontWeight: 500 }}>
              <span className="service-catalog-category">{modalService.category}</span>
              <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>₹{modalService.price}</span>
            </div>
            <div style={{ marginBottom: 12 }}><b>Duration:</b> {modalService.duration} min</div>
            <div style={{ marginBottom: 12 }}><b>Description:</b> {modalService.description || 'No description provided.'}</div>
            <div style={{ marginBottom: 12 }}><b>Company:</b> {modalService.provider || 'N/A'}</div>
            <div style={{ marginBottom: 12 }}><b>Address:</b> {modalService.location || 'N/A'}</div>
            <div style={{ marginBottom: 12 }}><b>Contact:</b> {modalService.contact || 'N/A'}</div>
            <div style={{ marginBottom: 12 }}><b>Status:</b> {modalService.isActive ? 'Active' : 'Inactive'}</div>
            {modalService.timeSlots && modalService.timeSlots.length > 0 && (
              <div style={{ marginBottom: 12 }}><b>Time Slots:</b> {modalService.timeSlots.join(', ')}</div>
            )}
          </div>
        </div>,
        document.body
      )}
      {showEditModal && editService && ReactDOM.createPortal(
        <div className="service-drawer-overlay" onClick={handleEditModalClose}>
          <div className="service-drawer" onClick={e => e.stopPropagation()}>
            <button className="close-drawer-btn" onClick={handleEditModalClose}>&times;</button>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 10 }}>Edit Service</h2>
            <ServiceForm service={editService} onClose={handleEditModalClose} onSuccess={handleEditModalClose} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProviderServices; 
import React, { useState } from 'react';
import ServiceForm from '../../components/ServiceForm';

const CategoryPage = ({ categoryName, children, onServiceAdded }) => {
  const [showForm, setShowForm] = useState(false);

  const handleServiceSuccess = (newService) => {
    setShowForm(false);
    
    // Call the parent callback if provided
    if (onServiceAdded && typeof onServiceAdded === 'function') {
      onServiceAdded(newService);
    }
  };

  return (
    <div className="category-page-wrapper">
      {/* Add Service Button */}
      <div style={{ textAlign: 'right', margin: '20px' }}>
        <button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: '#ff7597',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Add Service
        </button>
      </div>

      {/* Modal for adding service */}
      {showForm && (
        <ServiceForm
          category={categoryName}
          onClose={() => setShowForm(false)}
          onSuccess={handleServiceSuccess}
        />
      )}

      {/* Your specific category content */}
      {children}
    </div>
  );
};

export default CategoryPage;

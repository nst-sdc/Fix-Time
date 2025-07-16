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

  // Remove the Add Service button and ServiceForm modal from the client explore categories page. Only show category content and children.
  return (
    <div className="category-page-wrapper">
      {/* No Add Service Button or ServiceForm for clients */}
      {children}
    </div>
  );
};

// NOTE: This component can be reused for the 'Others' category page as well.

export default CategoryPage;

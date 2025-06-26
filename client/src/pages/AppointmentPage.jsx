import React from 'react';
import AppointmentBooking from '../components/AppointmentBooking.jsx';
import { useLocation } from 'react-router-dom';
import './AppointmentPage.css';

const AppointmentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const service = searchParams.get('service');

  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <h1>Book an Appointment</h1>
        {service && <p className="service-subtitle">For: {service}</p>}
      </div>
      <AppointmentBooking />
    </div>
  );
};

export default AppointmentPage;

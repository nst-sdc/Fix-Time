import React from 'react';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
  return (
    <form className="appointment-form">
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="date" />
      <input type="time" />
      <select>
        <option>Select Service</option>
        <option>Haircut</option>
        <option>Consultation</option>
      </select>
      <button type="submit">Book Now</button>
    </form>
  );
};

export default AppointmentBooking;

import React, { useState } from 'react';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment booked for ${date} at ${time}. Reason: ${reason}`);
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Time:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
      <div>
        <label>Reason for Appointment:</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
      </div>
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentBooking;

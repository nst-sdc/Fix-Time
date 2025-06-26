import React, { useState } from "react";
import "./AppointmentBooking.css";

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM",
  "10:30 AM", "11:30 AM", "1:00 PM",
  "2:00 PM", "2:30 PM", "3:30 PM",
  "4:30 PM", "5:30 PM"
];

const dateOptions = [
  "Wed, Jun 25", "Thu, Jun 26", "Fri, Jun 27", "Sat, Jun 28",
  "Sun, Jun 29", "Mon, Jun 30", "Tue, Jul 1"
];

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookedSlots([...bookedSlots, { date: selectedDate, time: selectedTime }]);
    alert(
      `✅ Appointment booked on ${selectedDate} at ${selectedTime}\n👤 Name: ${formData.name}`
    );
    
    setSelectedTime("");
    setFormData({ name: "", email: "", phone: "", reason: "" });
  };

  const isSlotDisabled = (date, time) => {
  const now = new Date();

  // Convert readable date like "Thu, Jun 26" to real date
  const [dayName, monthStr, dayNum] = date.replace(',', '').split(' ');
  const year = new Date().getFullYear(); 
  const fullDateStr = `${monthStr} ${dayNum}, ${year} ${time}`;
  const slotDateTime = new Date(fullDateStr);

  const isPast = slotDateTime < now;

  const isBooked = bookedSlots.some(
    (b) => b.date === date && b.time === time
  );

  return isPast || isBooked;
};


  return (
    <div className="booking-container">
      <h2>Book Your Appointment!</h2>

      <h4 className="section-heading">📅 Select a Date</h4>
      <div className="date-selector">
        {dateOptions.map((date) => (
          <button
            key={date}
            className={`date-button ${selectedDate === date ? "selected" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </div>

      <h4 className="section-heading">⏰ Select a Time Slot</h4>
      <div className="time-selector">
        {timeSlots.map((slot) => {
  const disabled = isSlotDisabled(selectedDate, slot);
  return (
    <button
      key={slot}
      className={`time-button ${
        selectedTime === slot ? "selected" : ""
      }`}
      onClick={() => !disabled && setSelectedTime(slot)}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer"
      }}
    >
      {slot}
    </button>
  );
})}

      </div>

      <form className="form-fields" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Full Name"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            value={formData.phone}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Enter your reason for Visit:</label>
          <textarea
            id="reason"
            name="reason"
            placeholder="Reason for Visit"
            rows={3}
            onChange={handleChange}
            value={formData.reason}
            required
          />
        </div>

        <button className="confirm-button" type="submit">
          Confirm Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;

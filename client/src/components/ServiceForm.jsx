// src/components/ServiceForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "./ServiceForm.css";

const ServiceForm = ({ category, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    companyName: "",
    address: "",
    city: "",
    contact: "",
    imageUrl: "",
    price: "",
    duration: "",
    timeSlots: [],
    category
  });

  const [slot, setSlot] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSlot = () => {
    if (slot.trim()) {
      setForm({ ...form, timeSlots: [...form.timeSlots, slot.trim()] });
      setSlot("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedData = {
      name: form.serviceName,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      duration: Number(form.duration),
      provider: form.companyName,
      location: `${form.address}, ${form.city}`,
      contact: form.contact,
      imageUrl: form.imageUrl,
      timeSlots: form.timeSlots,
    };

    try {
      await axios.post("http://localhost:5001/services", transformedData);
      alert("Service added!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adding service:", err.response?.data || err.message);
      alert("Error adding service.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="service-form-wrapper">
        <h3>Add New Service</h3>
        <form className="service-form" onSubmit={handleSubmit}>
          <input name="serviceName" placeholder="Service Name" onChange={handleChange} required />
          <input name="companyName" placeholder="Company Name" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" onChange={handleChange} required />
          <input name="price" placeholder="Price (e.g. 100)" type="number" onChange={handleChange} required />
          <input name="duration" placeholder="Duration in mins (e.g. 60)" type="number" onChange={handleChange} required />
          <input name="address" placeholder="Address" onChange={handleChange} required />
          <input name="city" placeholder="City" onChange={handleChange} required />
          <input name="contact" placeholder="Contact Email or Phone" onChange={handleChange} required />
          <input name="imageUrl" placeholder="Image URL (optional)" onChange={handleChange} />

          <div className="time-slot-section">
            <input
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              placeholder="Add Availability Slot (e.g. 10AM - 12PM)"
            />
            <button type="button" className="add-slot-btn" onClick={handleAddSlot}>Add Slot</button>
          </div>

          {form.timeSlots.length > 0 && (
            <div className="slot-display">
              <strong>Time Slots:</strong> {form.timeSlots.join(", ")}
            </div>
          )}

          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;


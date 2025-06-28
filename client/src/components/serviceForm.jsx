import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ServiceForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    brand: '',
    address: '',
    city: '',
    timeSlots: [],
    contact: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleTimeSlotChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(value)
        ? prev.timeSlots.filter(slot => slot !== value)
        : [...prev.timeSlots, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.description || !formData.contact) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      await axios.post('http://localhost:5000/services', formData);
      toast.success("Service added!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit service.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <input name="name" placeholder="Service Name" onChange={handleChange} required />
      <select name="category" onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Beauty">Beauty</option>
      </select>
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input name="price" placeholder="Price" type="number" onChange={handleChange} required />
      <input name="duration" placeholder="Duration (mins)" type="number" onChange={handleChange} required />
      <input name="brand" placeholder="Brand/Company" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="contact" placeholder="Email or Phone" onChange={handleChange} required />
      <input name="imageUrl" placeholder="Image URL (optional)" onChange={handleChange} />

      <label>Time Slots:</label>
      {['9AM–12PM', '12PM–3PM', '3PM–6PM', '6PM–9PM'].map(slot => (
        <label key={slot}>
          <input type="checkbox" value={slot} onChange={handleTimeSlotChange} />
          {slot}
        </label>
      ))}

      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
}

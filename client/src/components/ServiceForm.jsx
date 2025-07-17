import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../App';
import './ServiceForm.css';

const CATEGORIES = [
  'Healthcare & Wellness',
  'Beauty & Personal Care',
  'Home & Repair Services',
  'Education & Coaching',
  'Government / Legal Services',
  'Automobile Services',
  'Retail & Local Businesses',
  'Private Events',
  'Hotel & Restaurant',
  'Others'
];

const ServiceForm = ({ category, onClose, onSuccess, service }) => {
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
    category: category || "",
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (service) {
      setForm({
        serviceName: service.name || "",
        description: service.description || "",
        companyName: service.provider || "",
        address: service.location ? service.location.split(",")[0] : "",
        city: service.location ? service.location.split(",")[1]?.trim() || "" : "",
        contact: service.contact || "",
        imageUrl: service.imageUrl || "",
        price: service.price?.toString() || "",
        duration: service.duration?.toString() || "",
        timeSlots: service.timeSlots || [],
        category: service.category || category || "",
      });
    }
  }, [service, category]);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!form.serviceName.trim()) newErrors.serviceName = "Service name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.contact.trim()) {
      newErrors.contact = "Contact is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      if (!emailRegex.test(form.contact) && !phoneRegex.test(form.contact)) {
        newErrors.contact = "Enter a valid email or 10-digit phone number";
      }
    }

    if (!form.price || isNaN(form.price) || Number(form.price) < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!form.duration || isNaN(form.duration) || Number(form.duration) < 5) {
      newErrors.duration = "Duration must be at least 5 minutes";
    }

    if (!form.category) newErrors.category = "Category is required";

    if (form.imageUrl) {
      try {
        new URL(form.imageUrl);
      } catch {
        newErrors.imageUrl = "Enter a valid image URL";
      }
    }

    if (form.timeSlots.length === 0) {
      newErrors.timeSlots = "At least one time slot is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleRemoveSlot = (indexToRemove) => {
    const updatedSlots = form.timeSlots.filter((_, index) => index !== indexToRemove);
    setForm({ ...form, timeSlots: updatedSlots });
  };

  const generateTimeSlots = () => {
    if (!startTime || !endTime || !slotDuration || isNaN(slotDuration) || slotDuration <= 0) {
      setErrors({ ...errors, timeSlots: "Enter valid time range and slot duration" });
      return;
    }

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const start = new Date(0, 0, 0, startHour, startMin);
    const end = new Date(0, 0, 0, endHour, endMin);

    if (start >= end) {
      setErrors({ ...errors, timeSlots: "Start time must be before end time" });
      return;
    }

    const slots = [];
    let current = new Date(start);

    while (current < end) {
      const hours = current.getHours().toString().padStart(2, "0");
      const minutes = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + parseInt(slotDuration));
    }

    setForm({ ...form, timeSlots: slots });
    setErrors({ ...errors, timeSlots: "" });
  };

  const resetSlotFields = () => {
    setStartTime("");
    setEndTime("");
    setSlotDuration("");
    setForm({ ...form, timeSlots: [] });
    setErrors({ ...errors, timeSlots: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    const transformedData = {
      name: form.serviceName,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      duration: Number(form.duration),
      provider: form.companyName,
      location: `${form.address}, ${form.city}`,
      contact: form.contact,
      imageUrl: form.imageUrl || "",
      timeSlots: form.timeSlots,
    };

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      let response;
      if (service && service._id) {
        // Edit mode: PATCH
        response = await axios.patch(
          `${API_BASE_URL}/services/${service._id}`,
          transformedData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        // Add mode: POST
        response = await axios.post(
          `${API_BASE_URL}/services`,
          transformedData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      if (response.data.success) {
        onSuccess(response.data.data);
        onClose();
      } else {
        setSubmitError(response.data.message || (service ? "Failed to update service" : "Failed to add service"));
      }
    } catch (err) {
      console.error(service ? "Error updating service:" : "Error adding service:", err.response?.data || err.message);
      setSubmitError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="service-form-wrapper">
        <button className="close-modal-btn" onClick={onClose} aria-label="Close">&times;</button>
        <h3>{service ? 'Edit Service' : 'Add New Service'}</h3>
        {submitError && <div className="error-message">{submitError}</div>}
        <form className="service-form" onSubmit={handleSubmit}>
          {/* Category Dropdown */}
          <div className="form-group">
            <select name="category" value={form.category} onChange={handleChange} className={errors.category ? "error" : ""} required>
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>
          {/* Core Inputs */}
          <div className="form-group">
            <input name="serviceName" placeholder="Service Name" onChange={handleChange} value={form.serviceName} className={errors.serviceName ? "error" : ""} />
            {errors.serviceName && <span className="error-text">{errors.serviceName}</span>}
          </div>
          <div className="form-group">
            <input name="companyName" placeholder="Company Name" onChange={handleChange} value={form.companyName} className={errors.companyName ? "error" : ""} />
            {errors.companyName && <span className="error-text">{errors.companyName}</span>}
          </div>
          <div className="form-group">
            <textarea name="description" placeholder="Description" onChange={handleChange} value={form.description} className={errors.description ? "error" : ""} />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
          <div className="form-row">
            <div className="form-group half">
              <input name="price" placeholder="Price (₹)" type="number" onChange={handleChange} value={form.price} className={errors.price ? "error" : ""} />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
            <div className="form-group half">
              <input name="duration" placeholder="Duration (min)" type="number" onChange={handleChange} value={form.duration} className={errors.duration ? "error" : ""} />
              {errors.duration && <span className="error-text">{errors.duration}</span>}
            </div>
          </div>
          <div className="form-group">
            <input name="address" placeholder="Address" onChange={handleChange} value={form.address} className={errors.address ? "error" : ""} />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>
          <div className="form-group">
            <input name="city" placeholder="City" onChange={handleChange} value={form.city} className={errors.city ? "error" : ""} />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
          <div className="form-group">
            <input name="contact" placeholder="Contact Email or Phone" onChange={handleChange} value={form.contact} className={errors.contact ? "error" : ""} />
            {errors.contact && <span className="error-text">{errors.contact}</span>}
          </div>
          <div className="form-group">
            <input name="imageUrl" placeholder="Image URL (optional)" onChange={handleChange} value={form.imageUrl} />
            {errors.imageUrl && <span className="error-text">{errors.imageUrl}</span>}
          </div>

          {/* Slot Generator */}
          <div className="slot-generator">
            <div className="form-row">
              <div className="form-group third">
                <label>Start Time</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="form-group third">
                <label>End Time</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
              <div className="form-group third">
                <label>Slot Duration (min)</label>
                <input type="number" value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)} />
              </div>
            </div>
            <div className="slot-buttons">
              <button type="button" onClick={generateTimeSlots}>Generate Slots</button>
              <button type="button" className="reset-btn" onClick={resetSlotFields}>Reset</button>
            </div>
            {errors.timeSlots && <span className="error-text">{errors.timeSlots}</span>}
          </div>

          {/* Slot Preview */}
          {form.timeSlots.length > 0 && (
            <div className="slot-display">
              <strong>Time Slots:</strong>
              <ul className="time-slots-list">
                {form.timeSlots.map((timeSlot, index) => (
                  <li key={index}>
                    {timeSlot}
                    <button type="button" className="remove-slot-btn" onClick={() => handleRemoveSlot(index)}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
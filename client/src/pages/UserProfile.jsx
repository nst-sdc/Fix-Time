import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiSave, FiX, FiUser, FiPhone, FiMapPin, FiCalendar, FiMail } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile = ({ isLoggedIn, setIsLoggedIn, setUserProfile }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form state for editing
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [isLoggedIn, navigate]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5001/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      setFormData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phoneNumber: response.data.phoneNumber || '',
        address: response.data.address || '',
        dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toISOString().split('T')[0] : '',
        gender: response.data.gender || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(null);
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, setIsLoggedIn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5001/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);

      // Update the logged-in user data
      if (setIsLoggedIn) {
        setIsLoggedIn(response.data.user);
      }
      // Update the global user profile for Dashboard
      if (setUserProfile) {
        setUserProfile(response.data.user);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user.gender || ''
    });
    setIsEditing(false);
    setError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatGender = (gender) => {
    if (!gender) return 'Not provided';
    return gender.charAt(0).toUpperCase() + gender.slice(1).replace('-', ' ');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">User Profile</h1>
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 /> Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="save-button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FiSave /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <FiX /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <div className="profile-content">
          <div className="profile-section">
            <h2 className="section-title">Personal Information</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <FiUser /> Full Name
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="info-value">{user.fullName || 'Not provided'}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FiMail /> Email
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="info-value">{user.email}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FiPhone /> Phone Number
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="info-value">{user.phoneNumber || 'Not provided'}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FiCalendar /> Date of Birth
                </div>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <div className="info-value">{formatDate(user.dateOfBirth)}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">Gender</div>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="profile-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="info-value">{formatGender(user.gender)}</div>
                )}
              </div>

              <div className="info-item full-width">
                <div className="info-label">
                  <FiMapPin /> Address
                </div>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Enter your address"
                    rows="3"
                  />
                ) : (
                  <div className="info-value">{user.address || 'Not provided'}</div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Account Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Member Since</div>
                <div className="info-value">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Last Updated</div>
                <div className="info-value">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
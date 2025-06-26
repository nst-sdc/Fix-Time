import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import AuthPage from './pages/AuthPage';
import AppointmentPage from './pages/AppointmentPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100
    });
  }, []);

  // Set up axios defaults for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in based on JWT token
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      
      // Fetch user profile data
      const fetchUserProfile = async () => {
        try {
          const res = await axios.get('http://localhost:5001/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setUserProfile(res.data);
        } catch (err) {
          console.error('Error fetching profile:', err);
          // If token is invalid, logout
          if (err.response?.status === 401) {
            handleLogout();
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserProfile(userData);
    
    // Set Authorization header for future requests
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(null);
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    // You can add a loading spinner here
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} userProfile={userProfile} onLogout={handleLogout} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!isLoggedIn ? <AuthPage isLogin={true} setIsLoggedIn={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isLoggedIn ? <AuthPage isLogin={false} setIsLoggedIn={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/appointments" element={isLoggedIn ? <AppointmentPage /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={isLoggedIn ? 
              <Dashboard userProfile={userProfile} setUserProfile={setUserProfile} /> 
              : <Navigate to="/login" />} 
            />
            <Route path="/profile" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


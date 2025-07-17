import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import { useScrollToTop } from './utils/useScrollToTop';
import AuthPage from './pages/AuthPage';
import AppointmentPage from './pages/AppointmentPage';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProviderHomePage from './pages/ProviderHomePage';
import Services from './pages/Services';
import HealthcareCate from './pages/categories/HealthcareCate';
import BeautyCate from './pages/categories/BeautyCate';
import HomeRepairServices from './pages/categories/HomeRepairServices';
import EducationCoaching from './pages/categories/EducationCoaching';
import GovernmentLegalServices from './pages/categories/GovernmentLegalServices';
import AutomobileService from './pages/categories/AutomobileService';
import RetailLocalBusinesses from './pages/categories/RetailLocalBusinesses';
import PrivateEvents from './pages/categories/PrivateEvents';
import HotelRestaurant from './pages/categories/HotelRestaurant';
import AppointmentCalendar from './pages/AppointmentCalendar';
import RescheduleAppointment from './pages/RescheduleAppointment';
import MyAppointments from './pages/MyAppointments';
import ServiceList from './components/ServiceList';
import MyServices from './pages/MyServices';
import OtherServices from './pages/categories/OtherServices';
import AddService from './pages/AddService';
import ProviderServices from './pages/ProviderServices';

// Export API base URL for use in other components
export const API_BASE_URL = process.env.REACT_APP_API_URL || "https://fixtime-i368.onrender.com";

// Create theme context
export const ThemeContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const fetchUserProfile = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserProfile(res.data.user);
          console.log('[Profile Fetch] User profile after refresh:', res.data.user);
        } catch (err) {
          console.error('Error fetching profile:', err);
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
    const user = userData.user ? userData.user : userData;
    setUserProfile(user);
    console.log('[Login] User profile:', user);
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  if (loading) return <div className="loading-container">Loading...</div>;

  const themeContextValue = {
    theme,
    toggleTheme: handleThemeToggle
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <Router>
        <AppContent 
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          onLogout={handleLogout}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          handleLogin={handleLogin}
          setUserProfile={setUserProfile}
        />
      </Router>
    </ThemeContext.Provider>
  );
}

// Separate component to use hooks inside Router context
function AppContent({ 
  isLoggedIn, 
  userProfile, 
  onLogout, 
  theme, 
  onThemeToggle, 
  handleLogin, 
  setUserProfile 
}) {
  // Use scroll to top hook for automatic scrolling on route changes
  useScrollToTop();

  return (
    <div className={`App ${theme}`}>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        userProfile={userProfile} 
        onLogout={onLogout}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
      <main className="app-content">
        <Routes>
          <Route path="/" element={
            userProfile && userProfile.role === 'provider' ? <ProviderHomePage /> : <HomePage />
          } />
          <Route path="/login" element={!isLoggedIn ? <AuthPage isLogin={true} setIsLoggedIn={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isLoggedIn ? <AuthPage isLogin={false} setIsLoggedIn={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/services" element={<Services />} />
          <Route path="/categories/healthcare" element={<HealthcareCate />} />
          <Route path="/categories/beauty" element={<BeautyCate />} />
          <Route path="/categories/home-repair" element={<HomeRepairServices />} />
          <Route path="/categories/education" element={<EducationCoaching />} />
          <Route path="/categories/government-legal" element={<GovernmentLegalServices />} />
          <Route path="/categories/automobile" element={<AutomobileService />} />
          <Route path="/categories/retail" element={<RetailLocalBusinesses />} />
          <Route path="/categories/private-events" element={<PrivateEvents />} />
          <Route path="/categories/hotel-restaurant" element={<HotelRestaurant />} />
          <Route path="/categories/others" element={<OtherServices />} />
          <Route path="/appointments" element={isLoggedIn ? <AppointmentPage /> : <Navigate to="/login" />} />
          <Route path="/book" element={isLoggedIn ? <AppointmentPage /> : <Navigate to="/login" />} />
          <Route path="/reschedule" element={isLoggedIn ? <RescheduleAppointment /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard userProfile={userProfile} setUserProfile={setUserProfile} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <UserProfile isLoggedIn={isLoggedIn} setIsLoggedIn={handleLogin} setUserProfile={setUserProfile} /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={isLoggedIn ? <AppointmentCalendar /> : <Navigate to="/login" />} />
          <Route path="/my-appointments" element={isLoggedIn ? <MyAppointments /> : <Navigate to="/login" />} />
          <Route path="/my-services" element={isLoggedIn ? <MyServices /> : <Navigate to="/login" />} />
          <Route path="/demo-services" element={<ServiceList />} />
          <Route path="/add-service" element={
            isLoggedIn && userProfile?.role === 'provider'
              ? <AddService userProfile={userProfile} />
              : <Navigate to="/login" />
          } />
          <Route path="/provider-services" element={
            isLoggedIn && userProfile?.role === 'provider'
              ? <ProviderServices userProfile={userProfile} />
              : <Navigate to="/login" />
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

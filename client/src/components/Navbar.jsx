import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { FaUser, FaSignOutAlt, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const Navbar = ({ isLoggedIn, userProfile, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownOpen && !e.target.closest('.user-profile')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    onLogout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Fix<span className="accent-text">Time</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </div>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          
          {isLoggedIn && (
            <li className="nav-item">
              <Link to="/appointments" className="nav-link" onClick={() => setMenuOpen(false)}>
                Appointments
              </Link>
            </li>
          )}
          
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link nav-btn login-btn" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link nav-btn register-btn" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item user-profile">
              <div className="profile-button" onClick={toggleDropdown}>
                <div className="profile-info">
                  <div className="avatar-circle">
                    <FaUser className="profile-avatar-icon" />
                  </div>
                  <span className="profile-name">
                    {userProfile?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <FaChevronDown className={`dropdown-arrow ${dropdownOpen ? 'rotate' : ''}`} />
              </div>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar-container">
                      <FaUser className="dropdown-avatar-icon" />
                    </div>
                    <div className="dropdown-user-details">
                      <span className="dropdown-username">{userProfile?.email?.split('@')[0] || 'User'}</span>
                      <span className="dropdown-email">{userProfile?.email || 'user@example.com'}</span>
                    </div>
                  </div>
                  
                  <Link to="/dashboard" className="dropdown-item" onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}>
                    <FaUser className="dropdown-icon" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <div className="dropdown-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 
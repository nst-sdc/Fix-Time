import React from 'react';
import './navbar.css'

function Navbar() {
  return (
    // Main container for the Navbar, adjusted to remove extra space
    <div className="page-container">
      {/* Embedded CSS for the Navbar and page styles */}
      

      {/* Navbar structure */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Company Title */}
          <div className="navbar-title">
            FixTime
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <p className="nav-item">
              Home
            </p>
            <p className="nav-item">
              About Us
            </p>
            <p className="nav-item">
              Login
            </p>
          </div>

          {/* Register Button */}
          <div className="register-button-wrapper">
            <button className="register-button">
              Register
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

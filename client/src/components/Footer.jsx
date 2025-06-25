import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <div className="footer-logo">
              Fix<span className="footer-accent">Time</span>
            </div>
            <p className="footer-description">
              Queue-free appointment booking app that saves your precious time. Modern, fast, and hassle-free!
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaLinkedin />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/appointments">Appointments</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">For Businesses</h3>
            <ul className="footer-links">
              <li><a href="#">Partner With Us</a></li>
              <li><a href="#">Business Login</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Help & Support</h3>
            <ul className="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FixTime. All rights reserved.</p>
          <p>Made with ❤️ for GenZ and beyond</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
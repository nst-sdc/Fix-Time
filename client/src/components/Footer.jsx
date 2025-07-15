import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';

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
              The modern appointment scheduling platform that eliminates queues and saves your valuable time. Book effortlessly with our intuitive interface.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Discord">
                <FaDiscord />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Platform</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Browse Services</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/calendar">Calendar</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">For Businesses</h3>
            <ul className="footer-links">
              <li><a href="#">Join as Provider</a></li>
              <li><a href="#">Provider Dashboard</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Enterprise Solutions</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Community Forum</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FixTime. All rights reserved.</p>
          <div>
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a> • <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
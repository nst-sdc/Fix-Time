import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { FaClock, FaCalendarAlt, FaUserCheck, FaMobileAlt } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Book Appointments <span className="hero-highlight">Without The Queue</span>
          </h1>
          <p className="hero-description">
            Say goodbye to waiting in lines. FixTime lets you book appointments online 
            for clinics, salons, and more - saving you time and hassle.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/appointments" className="btn btn-secondary">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose <span className="text-accent">FixTime</span>?</h2>
          <p className="section-subtitle">Super simple. Super fast. Super convenient.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaClock />
            </div>
            <h3 className="feature-title">Save Time</h3>
            <p className="feature-description">
              No more waiting in physical queues. Book your slot in seconds and show up when it's your time.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaCalendarAlt />
            </div>
            <h3 className="feature-title">Easy Scheduling</h3>
            <p className="feature-description">
              Pick the perfect time slot that fits your schedule. Reschedule with just a tap if plans change.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaUserCheck />
            </div>
            <h3 className="feature-title">Instant Confirmation</h3>
            <p className="feature-description">
              Get confirmation immediately and reminders before your appointment.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaMobileAlt />
            </div>
            <h3 className="feature-title">Mobile Friendly</h3>
            <p className="feature-description">
              Book on the go with our mobile-optimized interface. No app download needed.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="section-header">
          <h2 className="section-title">How FixTime <span className="text-accent">Works</span></h2>
          <p className="section-subtitle">Three simple steps to fix your time</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Create Your Account</h3>
            <p className="step-description">
              Sign up in less than a minute with just your email
            </p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Browse & Book</h3>
            <p className="step-description">
              Find services and available time slots that work for you
            </p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Show Up On Time</h3>
            <p className="step-description">
              Get notifications and simply arrive at your scheduled time
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to save time?</h2>
          <p className="cta-description">
            Join thousands of users who have simplified their appointment booking experience
          </p>
          <Link to="/register" className="btn btn-primary btn-large">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
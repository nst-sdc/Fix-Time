import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { FaClock, FaCalendarAlt, FaUserCheck, FaMobileAlt, FaQuoteRight, FaArrowRight } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content" data-aos="fade-right">
            <div className="hero-badge">Appointment Scheduling Made Simple</div>
            <h1 className="hero-title">
              Skip the Queue<span className="hero-highlight">Book what's due</span>
            </h1>
            <p className="hero-description">
              Say goodbye to waiting in lines. FixTime lets you book appointments online 
              for clinics, salons, and more - saving you time and hassle.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Get Started
                <FaArrowRight className="btn-icon" />
              </Link>
              <Link to="/appointments" className="btn btn-secondary">
                Explore Services
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="hero-image" data-aos="fade-left">
            <div className="hero-illustration">
              <img src="https://cdn.jsdelivr.net/gh/priyabratasingh/static-assets/fixtime-hero.svg" 
                alt="Appointment Scheduling" 
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/2693/2693507.png"; 
                  e.target.style.maxWidth = "80%";
                }}
              />
            </div>
            <div className="blob-shape"></div>
          </div>
        </div>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f8fafc" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">Why Choose <span className="text-accent">FixTime</span>?</h2>
            <p className="section-subtitle">Super simple. Super fast. Super convenient.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3 className="feature-title">Save Time</h3>
              <p className="feature-description">
                No more waiting in physical queues. Book your slot in seconds and show up when it's your time.
              </p>
              <div className="feature-arrow">
                <FaArrowRight />
              </div>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">
                <FaCalendarAlt />
              </div>
              <h3 className="feature-title">Easy Scheduling</h3>
              <p className="feature-description">
                Pick the perfect time slot that fits your schedule. Reschedule with just a tap if plans change.
              </p>
              <div className="feature-arrow">
                <FaArrowRight />
              </div>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">
                <FaUserCheck />
              </div>
              <h3 className="feature-title">Instant Confirmation</h3>
              <p className="feature-description">
                Get confirmation immediately and reminders before your appointment.
              </p>
              <div className="feature-arrow">
                <FaArrowRight />
              </div>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-icon">
                <FaMobileAlt />
              </div>
              <h3 className="feature-title">Mobile Friendly</h3>
              <p className="feature-description">
                Book on the go with our mobile-optimized interface. No app download needed.
              </p>
              <div className="feature-arrow">
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">How FixTime <span className="text-accent">Works</span></h2>
            <p className="section-subtitle">Three simple steps to fix your time</p>
          </div>

          <div className="steps-container">
            <div className="step-connector"></div>
            <div className="step" data-aos="fade-up" data-aos-delay="100">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Your Account</h3>
              <p className="step-description">
                Sign up in less than a minute with just your email
              </p>
            </div>
            
            <div className="step" data-aos="fade-up" data-aos-delay="200">
              <div className="step-number">2</div>
              <h3 className="step-title">Browse & Book</h3>
              <p className="step-description">
                Find services and available time slots that work for you
              </p>
            </div>
            
            <div className="step" data-aos="fade-up" data-aos-delay="300">
              <div className="step-number">3</div>
              <h3 className="step-title">Show Up On Time</h3>
              <p className="step-description">
                Get notifications and simply arrive at your scheduled time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">What Our <span className="text-accent">Users Say</span></h2>
            <p className="section-subtitle">Join thousands of satisfied customers</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="100">
              <div className="testimonial-content">
                <FaQuoteRight className="quote-icon" />
                <p>FixTime has been a game-changer for my salon visits. No more waiting around for hours!</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JS</div>
                <div className="author-info">
                  <h4>Jamie Smith</h4>
                  <p>Regular User</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-content">
                <FaQuoteRight className="quote-icon" />
                <p>As a busy professional, FixTime helps me schedule appointments without disrupting my workday.</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">AT</div>
                <div className="author-info">
                  <h4>Alex Thompson</h4>
                  <p>Business Owner</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="300">
              <div className="testimonial-content">
                <FaQuoteRight className="quote-icon" />
                <p>The reminders feature is fantastic. I've never missed an appointment since using FixTime!</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MK</div>
                <div className="author-info">
                  <h4>Maya Kim</h4>
                  <p>Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <h2 className="cta-title">Ready to save time?</h2>
            <p className="cta-description">
              Join thousands of users who have simplified their appointment booking experience
            </p>
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Now
              <FaArrowRight className="btn-icon" />
            </Link>
          </div>
          <div className="cta-shapes">
            <div className="cta-shape shape-1"></div>
            <div className="cta-shape shape-2"></div>
            <div className="cta-shape shape-3"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
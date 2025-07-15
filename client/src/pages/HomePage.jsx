import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { FaClock, FaCalendarAlt, FaUserCheck, FaMobileAlt, FaQuoteRight, FaArrowRight } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Spline from '@splinetool/react-spline';

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('explore-services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to the services page if section not found
      window.location.href = '/services';
    }
  };

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
              <button onClick={scrollToServices} className="btn btn-primary explore-btn-pink">
                Explore Services
                <FaArrowRight className="btn-icon" />
              </button>
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
              <Spline scene="https://prod.spline.design/nOAbeVybOQvffhuC/scene.splinecode" />
            </div>
            <div className="blob-shape"></div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
            <path className="wave-path" d="M0,64L60,69.3C120,75,240,85,360,90.7C480,96,600,96,720,90.7C840,85,960,75,1080,69.3C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
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

      {/* Explore Services Section */}
      <section id="explore-services-section" className="services-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">Explore Our <span className="text-accent">Services</span></h2>
            <p className="section-subtitle">Book appointments for a wide range of services and skip the queues!</p>
          </div>
          
          <div className="services-grid">
            <Link to="/categories/healthcare" className="service-category-link">
              <div className="service-category-card" data-aos="fade-up" data-aos-delay="100">
                <div className="category-icon">🏥</div>
                <h3>Healthcare & Wellness</h3>
                <p>Medical consultations, checkups and more</p>
              </div>
            </Link>
            
            <Link to="/categories/beauty" className="service-category-link">
              <div className="service-category-card" data-aos="fade-up" data-aos-delay="200">
                <div className="category-icon">💇</div>
                <h3>Beauty & Personal Care</h3>
                <p>Haircuts, spa, and grooming services</p>
              </div>
            </Link>
            
            <Link to="/categories/home-repair" className="service-category-link">
              <div className="service-category-card" data-aos="fade-up" data-aos-delay="300">
                <div className="category-icon">🧰</div>
                <h3>Home & Repair Services</h3>
                <p>Electricians, plumbers, and maintenance</p>
              </div>
            </Link>
            
            <Link to="/categories/private-events" className="service-category-link">
              <div className="service-category-card" data-aos="fade-up" data-aos-delay="400">
                <div className="category-icon">🎉</div>
                <h3>Private Events</h3>
                <p>Webinars, parties, and celebrations</p>
              </div>
            </Link>
          </div>
          
          <div className="view-all-container" data-aos="fade-up">
            <Link to="/services" className="btn btn-secondary">
              View All Services
            </Link>
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
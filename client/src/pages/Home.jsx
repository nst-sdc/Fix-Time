import React from 'react';
import './Home.css';
import { Link} from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to FixTime</h1>
        <p className="tagline">
          {user?.name ? `Hello, ${user.name}!` : "Say goodbye to long queues. Book appointments smarter."}
        </p>
        <Link to={isAuthenticated ? "/appointments" : "/auth"}>
          <button className="cta-button">
            {isAuthenticated ? "Go to Appointments" : "Get Started"}
          </button>
        </Link>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <h2>🧠 The Problem</h2>
        <p>
          99 million Indians waste over 3 hours daily standing in queues —
          from hospitals to salons, productivity is lost everywhere.
        </p>
      </section>

      {/* Solution Section */}
      <section className="solution">
        <h2>💡 Our Solution</h2>
        <p>FixTime is a real-time appointment scheduler that:</p>
        <ul>
          <li>📅 Lets users book online based on availability</li>
          <li>📈 Helps providers manage schedules better</li>
          <li>🚫 Avoids peak hour crowding</li>
          <li>🕒 Fills idle time slots</li>
        </ul>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>⚙️ How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Sign Up</h3>
            <p>Create an account in seconds.</p>
          </div>
          <div className="step">
            <h3>2. Choose a Service</h3>
            <p>Pick from hospitals, salons, clinics, and more.</p>
          </div>
          <div className="step">
            <h3>3. Book a Slot</h3>
            <p>Select a time that suits you.</p>
          </div>
        </div>
      </section>

      {/* Widgets Section */}
      {isAuthenticated && (
        <section className="dashboard-widgets">
          <h2>📊 Your Dashboard</h2>
          <div className="widgets-grid">
            <div className="widget">📅 Upcoming Appointments: <strong>0</strong></div>
            <div className="widget">✅ Recently Booked: <strong>None</strong></div>
            <div className="widget">📈 Productivity Saved: <strong>0 hrs</strong></div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="final-cta">
        <h2>Ready to save time?</h2>
        <Link to={isAuthenticated ? "/appointments" : "/auth"}>
          <button className="cta-button">
            {isAuthenticated ? "Book an Appointment" : "Login Now"}
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Home;

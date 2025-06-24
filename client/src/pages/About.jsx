// src/pages/About.jsx
import React from "react";
import './About.css'; 

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About FixTime</h1>
      <p className="about-problem">
        <strong>🧠 The Problem:</strong> Every day, millions of people lose valuable time waiting in queues. In India alone, over <strong>99 million</strong> individuals spend more than <strong>3 hours daily</strong> standing in lines — totaling a staggering <strong>297 lakh hours</strong> of lost productivity every single day.
      </p>
      <p className="about-context">
        Whether it's patients waiting outside hospitals from early morning just to get a token, or customers walking away from local salons due to visible queues — time is wasted, appointments are missed, and efficiency is lost.
      </p>
      <h2 className="about-subtitle">💡 Our Solution: FixTime</h2>
      <p className="about-solution">
        <strong>FixTime</strong> is a real-time smart appointment scheduler that brings efficiency to both users and service providers.
      </p>
      <ul className="about-features">
        <li>📅 Book slots online based on real-time availability</li>
        <li>📈 Helps providers manage appointments smoothly</li>
        <li>🚫 Prevents crowding during peak hours</li>
        <li>🕒 Fills idle gaps during off-peak times</li>
      </ul>
      <p className="about-impact">
        With FixTime, <strong>users save time</strong>, <strong>service providers stay organized</strong>, and <strong>everyone wins</strong>.
      </p>
    </div>
  );
};

export default About;

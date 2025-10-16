import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const specialities = [
    { icon: "🫀", name: "Cardiology", description: "Heart & cardiovascular care" },
    { icon: "🧠", name: "Neurology", description: "Brain & nervous system" },
    { icon: "🦷", name: "Dentistry", description: "Oral & dental health" },
    { icon: "👁️", name: "Ophthalmology", description: "Eye care & vision" },
    { icon: "🦴", name: "Orthopedics", description: "Bones & joints" },
    { icon: "👶", name: "Pediatrics", description: "Children's health" },
  ];

  const stats = [
    { value: "2,000+", label: "Verified Doctors" },
    { value: "50,000+", label: "Happy Patients" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <div className="home-page">
      <Header />
      <main className="home-main">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-background-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                Trusted Healthcare Platform
              </div>
              <h1>
                Your Health Journey<br />
                Digitally Managed and   <span className="gradient-text">Always Accessible</span>
              </h1>
              <p>
                
              </p>
              <div className="hero-actions">
                <Link to="/doctors" className="book-appointment-btn primary">
                  Book Appointment
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <button className="book-appointment-btn secondary">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm-1 14.414l-3.707-3.707 1.414-1.414L9 11.586l4.293-4.293 1.414 1.414L9 14.414z"/>
                  </svg>
                  How It Works
                </button>
              </div>
              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-image">
              <div className="image-wrapper">
                <div className="image-glow"></div>
                <img
                  src="/src/assets/images/dash.png"
                  alt="Healthcare professionals"
                />
                
                <div className="floating-card card-2">
                  <div className="card-icon">⭐</div>
                  <div className="card-text">
                    <div className="card-title">4.9 Rating</div>
                    <div className="card-subtitle">From 2k+ patients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Speciality Section */}
        <div className="speciality-section">
          <div className="section-header">
            <div className="section-badge">Our Services</div>
            <h2>Find Care by Speciality</h2>
            <p className="section-description">
              Choose from our wide range of medical specialties and find the right expert for your needs
            </p>
          </div>
          <div className="speciality-grid">
            {specialities.map((speciality, index) => (
              <div key={index} className="speciality-card">
                <div className="card-inner">
                  <div className="speciality-icon-wrapper">
                    <div className="icon-background"></div>
                    <span className="speciality-icon">{speciality.icon}</span>
                  </div>
                  <h3>{speciality.name}</h3>
                  <p className="speciality-description">{speciality.description}</p>
                  <div className="card-footer">
                    <span className="view-doctors">View Doctors</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied patients who trust us with their healthcare needs</p>
            <Link to="/doctors" className="cta-button">
              Find Your Doctor Today
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
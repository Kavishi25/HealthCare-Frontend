import React from "react";
import Header from "../components/Header";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <Header />
      <main className="about-main">
        <div className="about-hero">
          <div className="about-hero-content">
            <h1>About HealthCare</h1>
            <p>Your trusted partner in healthcare management</p>
          </div>
        </div>

        <div className="about-content">
          <section className="about-section">
            <div className="section-content">
              <h2>Our Mission</h2>
              <p>
                At HealthCare, we are committed to revolutionizing healthcare by
                providing seamless access to trusted medical professionals. Our
                platform connects patients with qualified doctors, making
                healthcare more accessible and efficient.
              </p>
            </div>
          </section>

          <section className="about-section">
            <div className="section-content">
              <h2>Why Choose HealthCare?</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🏥</div>
                  <h3>Trusted Doctors</h3>
                  <p>
                    All our doctors are verified and highly qualified
                    professionals
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📅</div>
                  <h3>Easy Booking</h3>
                  <p>
                    Book appointments hassle-free with our intuitive platform
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔒</div>
                  <h3>Secure & Private</h3>
                  <p>
                    Your health data is protected with industry-standard
                    security
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⏰</div>
                  <h3>24/7 Support</h3>
                  <p>Round-the-clock customer support for all your needs</p>
                </div>
              </div>
            </div>
          </section>

          <section className="stats-section">
            <div className="stats-content">
              <h2>Our Impact</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>1000+</h3>
                  <p>Happy Patients</p>
                </div>
                <div className="stat-item">
                  <h3>50+</h3>
                  <p>Expert Doctors</p>
                </div>
                <div className="stat-item">
                  <h3>20+</h3>
                  <p>Specialties</p>
                </div>
                <div className="stat-item">
                  <h3>24/7</h3>
                  <p>Available Support</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;

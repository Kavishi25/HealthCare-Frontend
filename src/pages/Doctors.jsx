import React from "react";
import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useDoctors } from "../hooks/useDoctors";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "../styles/Doctors.css";

const Doctors = () => {
  const { doctors: allDoctors, loading, error, refetch } = useDoctors();

  return (
    <div className="doctors-page">
      <Header />
      <main className="doctors-main">
        <div className="doctors-header">
          <h1>Our Trusted Doctors</h1>
          <p>
            Browse through our extensive list of trusted doctors and book your
            appointment
          </p>
        </div>

        {loading && <LoadingSpinner message="Loading doctors..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && (
          <div className="doctors-grid">
            {allDoctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-image">
                  <div className="doctor-placeholder-avatar">
                    {doctor.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`availability-badge ${
                      doctor.availableSlots?.length > 0 ? "available" : "unavailable"
                    }`}
                  >
                    {doctor.availableSlots?.length > 0 ? "Available" : "Busy"}
                  </div>
                </div>

                <div className="doctor-info">
                  <h3>Dr. {doctor.name}</h3>
                  <p className="specialty">{doctor.specialty}</p>
                  <p className="experience">
                    {doctor.availableSlots?.length || 0} available slots
                  </p>

                  <div className="doctor-rating">
                    <span className="rating">⭐ 4.8</span>
                  </div>

                  <Link
                    to="/book-appointment"
                    className={`book-btn ${
                      !doctor.availableSlots?.length ? "disabled" : ""
                    }`}
                    onClick={(e) => {
                      if (!doctor.availableSlots?.length) {
                        e.preventDefault();
                      } else {
                        // Store selected doctor in localStorage for BookAppointmentPage
                        localStorage.setItem('preSelectedDoctorId', doctor._id);
                      }
                    }}
                  >
                    {doctor.availableSlots?.length
                      ? "Book Appointment"
                      : "Not Available"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && allDoctors.length === 0 && (
          <div className="no-doctors">
            <p>No doctors available at the moment.</p>
          </div>
        )}

        <div className="payment-section">
          <Link to="/payment" className="payment-btn">
            Make a Payment
          </Link>
        </div>
        
      </main>
    </div>
  );
};

export default Doctors;
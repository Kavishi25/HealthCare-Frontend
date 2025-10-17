import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useDoctors } from "../hooks/useDoctors";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "../styles/Doctors.css";

const Doctors = () => {
  const { doctors: allDoctors, loading, error, refetch } = useDoctors();

  // Function to generate different gradient colors for each doctor
  const getGradientColor = (index) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
    ];
    return gradients[index % gradients.length];
  };

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
            {allDoctors.map((doctor, index) => (
              <div key={doctor._id} className="doctor-card">
                <div
                  className="doctor-image"
                  style={{ background: getGradientColor(index) }}
                >
                  <div className="doctor-avatar-circle">
                    {doctor.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`availability-badge ${
                      doctor.availableSlots?.length > 0
                        ? "available"
                        : "unavailable"
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

                  <div className="doctor-charge">
                    <span className="charge-label">💵 Consultation Fee:</span>
                    <span className="charge-value">
                      LKR {doctor.chargePerSlot || 0}
                    </span>
                  </div>

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
                        localStorage.setItem("preSelectedDoctorId", doctor._id);
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
      </main>
    </div>
  );
};

export default Doctors;

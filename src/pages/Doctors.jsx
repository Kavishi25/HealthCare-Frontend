import React from "react";
import Header from "../components/Header";
import "../styles/Doctors.css";

const Doctors = () => {
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "10 years",
      rating: 4.9,
      image: "https://via.placeholder.com/150x150/4f46e5/ffffff?text=SJ",
      available: true,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "8 years",
      rating: 4.8,
      image: "https://via.placeholder.com/150x150/10b981/ffffff?text=MC",
      available: true,
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialty: "Dermatologist",
      experience: "12 years",
      rating: 4.9,
      image: "https://via.placeholder.com/150x150/f59e0b/ffffff?text=ED",
      available: false,
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedist",
      experience: "15 years",
      rating: 4.7,
      image: "https://via.placeholder.com/150x150/ef4444/ffffff?text=JW",
      available: true,
    },
    {
      id: 5,
      name: "Dr. Lisa Anderson",
      specialty: "Pediatrician",
      experience: "7 years",
      rating: 4.8,
      image: "https://via.placeholder.com/150x150/8b5cf6/ffffff?text=LA",
      available: true,
    },
    {
      id: 6,
      name: "Dr. Robert Brown",
      specialty: "Ophthalmologist",
      experience: "11 years",
      rating: 4.6,
      image: "https://via.placeholder.com/150x150/06b6d4/ffffff?text=RB",
      available: true,
    },
  ];

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

        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-image">
                <img src={doctor.image} alt={doctor.name} />
                <div
                  className={`availability-badge ${
                    doctor.available ? "available" : "unavailable"
                  }`}
                >
                  {doctor.available ? "Available" : "Busy"}
                </div>
              </div>

              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="specialty">{doctor.specialty}</p>
                <p className="experience">{doctor.experience} experience</p>

                <div className="doctor-rating">
                  <span className="rating">⭐ {doctor.rating}</span>
                </div>

                <button
                  className={`book-btn ${!doctor.available ? "disabled" : ""}`}
                  disabled={!doctor.available}
                >
                  {doctor.available ? "Book Appointment" : "Not Available"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Doctors;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: "💰",
      value: "$130",
      label: "Earnings",
      color: "#3b82f6",
    },
    {
      icon: "📅",
      value: "4",
      label: "Appointments",
      color: "#10b981",
    },
    {
      icon: "👥",
      value: "2",
      label: "Patients",
      color: "#f59e0b",
    },
  ];

  const bookings = [
    {
      id: 1,
      patient: "Avinash Kr",
      date: "Booking on 5 Oct 2024",
      status: "Completed",
      avatar: "https://via.placeholder.com/40x40/4f46e5/ffffff?text=A",
    },
    {
      id: 2,
      patient: "GreatStock",
      date: "Booking on 26 Sep 2024",
      status: "Cancelled",
      avatar: "https://via.placeholder.com/40x40/ef4444/ffffff?text=G",
    },
    {
      id: 3,
      patient: "GreatStock",
      date: "Booking on 25 Sep 2024",
      status: "Completed",
      avatar: "https://via.placeholder.com/40x40/10b981/ffffff?text=G",
    },
    {
      id: 4,
      patient: "GreatStock",
      date: "Booking on 25 Sep 2024",
      status: "Completed",
      avatar: "https://via.placeholder.com/40x40/10b981/ffffff?text=G",
    },
  ];

  const adminMenuItems = [
    {
      icon: "📊",
      label: "Dashboard",
      path: "/admin-dashboard",
      isActive: true,
    },
    {
      icon: "📅",
      label: "Appointments",
      path: "/admin/appointments",
      isActive: false,
    },
    {
      icon: "👨‍⚕️",
      label: "Manage Doctors",
      path: "/admin/manage-doctors",
      isActive: false,
    },
    {
      icon: "👤",
      label: "Profile",
      path: "/admin/profile",
      isActive: false,
    },
  ];

  const handleLogout = () => {
    // Clear any stored auth tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('patientId');
    // Navigate to home
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <h2>HealthCare</h2>
            <span className="admin-badge">Doctor</span>
          </div>
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <img
                src="https://via.placeholder.com/40x40/4f46e5/ffffff?text=D"
                alt="Doctor"
              />
            </div>
            <div className="admin-user-details">
              <button className="admin-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <ul className="admin-nav-menu">
            {adminMenuItems.map((item, index) => (
              <li key={index} className="admin-nav-item">
                <Link
                  to={item.path}
                  className={`admin-nav-link ${item.isActive ? "active" : ""}`}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span className="admin-nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-main">
          <div className="admin-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="admin-stat-card">
                <div className="admin-stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="admin-stat-content">
                  <h3 className="admin-stat-value">{stat.value}</h3>
                  <p className="admin-stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-bookings-section">
            <div className="admin-section-header">
              <h2>📋 Latest Bookings</h2>
              <Link to="/admin/appointments" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="admin-bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="admin-booking-item">
                  <div className="admin-booking-avatar">
                    <img src={booking.avatar} alt={booking.patient} />
                  </div>
                  <div className="admin-booking-details">
                    <h4>{booking.patient}</h4>
                    <p>{booking.date}</p>
                  </div>
                  <div
                    className={`admin-booking-status ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
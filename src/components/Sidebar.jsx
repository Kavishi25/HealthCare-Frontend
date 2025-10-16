import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: "📊",
      label: "Dashboard",
      path: "/patient-dashboard",
    },
    {
      icon: "📅",
      label: "Appointments",
      path: "/appointments",
    },
    {
      icon: "👤",
      label: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            <img
              src="https://via.placeholder.com/40x40/4f46e5/ffffff?text=P"
              alt="Profile"
            />
          </div>
          <div className="user-details">
            <h4>Patient</h4>
            <span className="user-role">Doctor</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

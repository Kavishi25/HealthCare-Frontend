import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/AdminProfile.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenuItems = [
    {
      icon: "📊",
      label: "Dashboard",
      path: "/admin-dashboard",
    },
    {
      icon: "📅",
      label: "Appointments",
      path: "/admin/appointments",
    },
    {
      icon: "👨‍⚕️",
      label: "Manage Doctors",
      path: "/admin/manage-doctors",
    },
    {
      icon: "👤",
      label: "Profile",
      path: "/admin/profile",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('patientId');
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
                  className={`admin-nav-link ${location.pathname === item.path ? "active" : ""}`}
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
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
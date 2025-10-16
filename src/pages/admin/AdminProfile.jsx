import React, { useState } from 'react';
import AdminLayout from '../admin/AdminLayout';
import '../../styles/AdminProfile.css';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Dr. John Smith',
    email: 'john.smith@healthcare.com',
    phone: '+1 234 567 8900',
    specialty: 'Cardiology',
    experience: '15 years',
    education: 'MD, Harvard Medical School',
  });

  const [editing, setEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    alert('Profile updated successfully!');
    setEditing(false);
  };

  return (
    <AdminLayout>
      <div className="rasa-admin-profile-page">
        <div className="rasa-page-header">
          <h1>My Profile</h1>
          {!editing ? (
            <button className="rasa-edit-profile-btn" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="rasa-profile-actions">
              <button className="rasa-cancel-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button className="rasa-save-btn" onClick={handleSave}>
                💾 Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="rasa-profile-container">
          <div className="rasa-profile-avatar-section">
            <div className="rasa-profile-avatar-large">
              <img
                src="https://via.placeholder.com/120x120/4f46e5/ffffff?text=JS"
                alt="Profile"
              />
            </div>
            {editing && (
              <button className="rasa-change-photo-btn">Change Photo</button>
            )}
          </div>

          <div className="rasa-profile-form">
            <div className="rasa-form-row">
              <div className="rasa-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>
              
              <div className="rasa-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="rasa-form-row">
              <div className="rasa-form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>
              
              <div className="rasa-form-group">
                <label>Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={profileData.specialty}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="rasa-form-row">
              <div className="rasa-form-group">
                <label>Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>
              
              <div className="rasa-form-group">
                <label>Education</label>
                <input
                  type="text"
                  name="education"
                  value={profileData.education}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
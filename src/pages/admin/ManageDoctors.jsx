import React, { useState } from 'react';
import { useDoctors } from '../../hooks/useDoctors';
import AdminLayout from '../../pages/admin/AdminLayout';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../styles/ManageDoctors.css';

const ManageDoctors = () => {
  const { doctors: allDoctors, loading, error, refetch } = useDoctors();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    availableSlots: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({ date: '', time: '' });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add time slot to specific date
  const addTimeSlot = () => {
    if (!currentSlot.date || !currentSlot.time) {
      alert('⚠️ Please select both date and time');
      return;
    }

    const existingDateIndex = formData.availableSlots.findIndex(
      slot => slot.date === currentSlot.date
    );

    if (existingDateIndex >= 0) {
      const updatedSlots = [...formData.availableSlots];
      if (!updatedSlots[existingDateIndex].slots.includes(currentSlot.time)) {
        updatedSlots[existingDateIndex].slots.push(currentSlot.time);
        setFormData({ ...formData, availableSlots: updatedSlots });
      } else {
        alert('⚠️ This time slot already exists for this date');
        return;
      }
    } else {
      setFormData({
        ...formData,
        availableSlots: [
          ...formData.availableSlots,
          { date: currentSlot.date, slots: [currentSlot.time] }
        ]
      });
    }

    setCurrentSlot({ date: '', time: '' });
  };

  // Remove time slot
  const removeTimeSlot = (dateIndex, timeIndex) => {
    const updatedSlots = [...formData.availableSlots];
    updatedSlots[dateIndex].slots.splice(timeIndex, 1);
    
    if (updatedSlots[dateIndex].slots.length === 0) {
      updatedSlots.splice(dateIndex, 1);
    }
    
    setFormData({ ...formData, availableSlots: updatedSlots });
  };

  // Add new doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add doctor');

      alert('✅ Doctor added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', specialty: '', availableSlots: [] });
      refetch();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit doctor
  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      availableSlots: doctor.availableSlots || []
    });
    setShowEditModal(true);
  };

  // Update doctor
  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/doctors/${selectedDoctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update doctor');

      alert('✅ Doctor updated successfully!');
      setShowEditModal(false);
      setSelectedDoctor(null);
      refetch();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete doctor');

      alert('✅ Doctor deleted successfully!');
      refetch();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  // Filter doctors
  const filteredDoctors = allDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get total slots count
  const getTotalSlots = (availableSlots) => {
    return availableSlots?.reduce((total, slot) => total + (slot.slots?.length || 0), 0) || 0;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <AdminLayout>
      <div className="rasa-manage-doctors-page">
        {/* Header Section */}
        <div className="rasa-page-header-section">
          <div className="rasa-header-content">
            <div className="rasa-header-title-group">
              <div className="rasa-header-badge">Admin Dashboard</div>
              <h1 className="rasa-page-title">Manage Doctors</h1>
              <p className="rasa-page-subtitle">
                Add, edit, and manage doctor profiles and their available time slots
              </p>
            </div>
            <button
              className="rasa-btn-primary rasa-add-doctor-btn"
              onClick={() => setShowAddModal(true)}
            >
              <span className="rasa-btn-icon">+</span>
              <span className="rasa-btn-text">Add New Doctor</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="rasa-search-container">
            <div className="rasa-search-wrapper">
              <span className="rasa-search-icon">🔍</span>
              <input
                type="text"
                className="rasa-search-input"
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="rasa-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="rasa-loading-wrapper">
            <LoadingSpinner message="Loading doctors..." />
          </div>
        )}
        
        {error && (
          <div className="rasa-error-wrapper">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        )}

        {/* Doctors List */}
        {!loading && !error && (
          <>
            {/* Stats Bar */}
            <div className="rasa-stats-bar">
              <div className="rasa-stat-item">
                <div className="rasa-stat-icon-box">👨‍⚕️</div>
                <div className="rasa-stat-content">
                  <span className="rasa-stat-label">Total Doctors</span>
                  <span className="rasa-stat-value">{filteredDoctors.length}</span>
                </div>
              </div>
              <div className="rasa-stat-item">
                <div className="rasa-stat-icon-box">🔍</div>
                <div className="rasa-stat-content">
                  <span className="rasa-stat-label">Search Results</span>
                  <span className="rasa-stat-value">{filteredDoctors.length}</span>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="rasa-doctors-grid">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="rasa-doctor-card">
                  {/* Card Header */}
                  <div className="rasa-doctor-card-header">
                    <div className="rasa-doctor-avatar">
                      {doctor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="rasa-doctor-info">
                      <h3 className="rasa-doctor-name">Dr. {doctor.name}</h3>
                      <p className="rasa-doctor-specialty">
                        <span className="rasa-specialty-icon">🩺</span>
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="rasa-doctor-card-body">
                    <div className="rasa-slots-summary">
                      <div className="rasa-slots-header">
                        <span className="rasa-slots-icon">📅</span>
                        <span className="rasa-slots-title">Available Slots</span>
                      </div>
                      <div className="rasa-slots-count">
                        {getTotalSlots(doctor.availableSlots)} slots
                      </div>
                    </div>

                    {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
                      <div className="rasa-slots-preview">
                        {doctor.availableSlots.slice(0, 2).map((dateSlot, idx) => (
                          <div key={idx} className="rasa-slot-date-group">
                            <div className="rasa-slot-date">
                              {formatDate(dateSlot.date)}
                            </div>
                            <div className="rasa-slot-times">
                              {dateSlot.slots?.slice(0, 3).map((time, tidx) => (
                                <span key={tidx} className="rasa-slot-time-badge">
                                  {time}
                                </span>
                              ))}
                              {dateSlot.slots?.length > 3 && (
                                <span className="rasa-slot-more">
                                  +{dateSlot.slots.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {doctor.availableSlots.length > 2 && (
                          <div className="rasa-slots-more-dates">
                            +{doctor.availableSlots.length - 2} more dates
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rasa-no-slots-message">
                        <span className="rasa-no-slots-icon">⚠️</span>
                        No slots available yet
                      </div>
                    )}
                  </div>

                  {/* Card Footer with Action Buttons */}
                  <div className="rasa-doctor-card-footer">
                    <button
                      className="rasa-btn-secondary rasa-btn-edit"
                      onClick={() => handleEditDoctor(doctor)}
                      aria-label={`Edit Dr. ${doctor.name}`}
                    >
                      <span className="rasa-btn-icon">✏️</span>
                      <span className="rasa-btn-text">Edit</span>
                    </button>
                    <button
                      className="rasa-btn-danger rasa-btn-delete"
                      onClick={() => handleDeleteDoctor(doctor._id)}
                      aria-label={`Delete Dr. ${doctor.name}`}
                    >
                      <span className="rasa-btn-icon">🗑️</span>
                      <span className="rasa-btn-text">Delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredDoctors.length === 0 && (
                <div className="rasa-empty-state">
                  <div className="rasa-empty-icon">
                    {searchTerm ? '🔍' : '👨‍⚕️'}
                  </div>
                  <h3 className="rasa-empty-title">
                    {searchTerm ? 'No Doctors Found' : 'No Doctors Yet'}
                  </h3>
                  <p className="rasa-empty-message">
                    {searchTerm 
                      ? `No doctors match "${searchTerm}". Try a different search term.`
                      : "Start by adding your first doctor to the system."}
                  </p>
                  {!searchTerm && (
                    <button 
                      className="rasa-empty-action-btn"
                      onClick={() => setShowAddModal(true)}
                    >
                      <span className="rasa-btn-icon">+</span>
                      Add First Doctor
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Add Doctor Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => !submitting && setShowAddModal(false)}
          title="Add New Doctor"
          size="large"
        >
          <form onSubmit={handleAddDoctor} className="rasa-doctor-form">
            <div className="rasa-form-section">
              <h3 className="rasa-form-section-title">
                <span className="rasa-section-icon">📋</span>
                Basic Information
              </h3>
              
              <div className="rasa-form-group">
                <label className="rasa-form-label">
                  <span className="rasa-label-icon">👤</span>
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter doctor's full name"
                  className="rasa-form-input"
                />
              </div>

              <div className="rasa-form-group">
                <label className="rasa-form-label">
                  <span className="rasa-label-icon">🩺</span>
                  Specialty *
                </label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Cardiology, Neurology, Pediatrics"
                  className="rasa-form-input"
                />
              </div>
            </div>

            <div className="rasa-form-section">
              <h3 className="rasa-form-section-title">
                <span className="rasa-section-icon">📅</span>
                Available Time Slots
              </h3>
              
              <div className="rasa-slot-input-container">
                <div className="rasa-slot-input-group">
                  <div className="rasa-form-group rasa-form-group-inline">
                    <label className="rasa-form-label-small">Date</label>
                    <input
                      type="date"
                      value={currentSlot.date}
                      onChange={(e) => setCurrentSlot({ ...currentSlot, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="rasa-form-input rasa-form-input-date"
                    />
                  </div>

                  <div className="rasa-form-group rasa-form-group-inline">
                    <label className="rasa-form-label-small">Time</label>
                    <select
                      value={currentSlot.time}
                      onChange={(e) => setCurrentSlot({ ...currentSlot, time: e.target.value })}
                      className="rasa-form-select"
                    >
                      <option value="">Select time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="rasa-btn-add-slot"
                  >
                    <span className="rasa-btn-icon">+</span>
                    <span className="rasa-btn-text">Add</span>
                  </button>
                </div>
              </div>

              {formData.availableSlots.length > 0 && (
                <div className="rasa-slots-list">
                  <div className="rasa-slots-list-header">
                    <span>Added Slots ({getTotalSlots(formData.availableSlots)} total)</span>
                  </div>
                  {formData.availableSlots.map((dateSlot, dateIndex) => (
                    <div key={dateIndex} className="rasa-slot-date-card">
                      <div className="rasa-slot-date-header">
                        <span className="rasa-slot-date-icon">📅</span>
                        <span className="rasa-slot-date-text">
                          {formatDate(dateSlot.date)}
                        </span>
                      </div>
                      <div className="rasa-slot-times-list">
                        {dateSlot.slots.map((time, timeIndex) => (
                          <div key={timeIndex} className="rasa-slot-time-item">
                            <span className="rasa-slot-time-icon">🕐</span>
                            <span className="rasa-slot-time-text">{time}</span>
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(dateIndex, timeIndex)}
                              className="rasa-slot-remove-btn"
                              title="Remove slot"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rasa-form-actions">
              <button
                type="button"
                className="rasa-btn-cancel"
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rasa-btn-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="rasa-spinner"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="rasa-btn-icon">✓</span>
                    Add Doctor
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Doctor Modal - Same structure as Add Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => !submitting && setShowEditModal(false)}
          title={`Edit Dr. ${selectedDoctor?.name}`}
          size="large"
        >
          <form onSubmit={handleUpdateDoctor} className="rasa-doctor-form">
            <div className="rasa-form-section">
              <h3 className="rasa-form-section-title">
                <span className="rasa-section-icon">📋</span>
                Basic Information
              </h3>
              
              <div className="rasa-form-group">
                <label className="rasa-form-label">
                  <span className="rasa-label-icon">👤</span>
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="rasa-form-input"
                />
              </div>

              <div className="rasa-form-group">
                <label className="rasa-form-label">
                  <span className="rasa-label-icon">🩺</span>
                  Specialty *
                </label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  required
                  className="rasa-form-input"
                />
              </div>
            </div>

            <div className="rasa-form-section">
              <h3 className="rasa-form-section-title">
                <span className="rasa-section-icon">📅</span>
                Available Time Slots
              </h3>
              
              <div className="rasa-slot-input-container">
                <div className="rasa-slot-input-group">
                  <div className="rasa-form-group rasa-form-group-inline">
                    <label className="rasa-form-label-small">Date</label>
                    <input
                      type="date"
                      value={currentSlot.date}
                      onChange={(e) => setCurrentSlot({ ...currentSlot, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="rasa-form-input rasa-form-input-date"
                    />
                  </div>

                  <div className="rasa-form-group rasa-form-group-inline">
                    <label className="rasa-form-label-small">Time</label>
                    <select
                      value={currentSlot.time}
                      onChange={(e) => setCurrentSlot({ ...currentSlot, time: e.target.value })}
                      className="rasa-form-select"
                    >
                      <option value="">Select time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="rasa-btn-add-slot"
                  >
                    <span className="rasa-btn-icon">+</span>
                    <span className="rasa-btn-text">Add</span>
                  </button>
                </div>
              </div>

              {formData.availableSlots.length > 0 && (
                <div className="rasa-slots-list">
                  <div className="rasa-slots-list-header">
                    <span>Available Slots ({getTotalSlots(formData.availableSlots)} total)</span>
                  </div>
                  {formData.availableSlots.map((dateSlot, dateIndex) => (
                    <div key={dateIndex} className="rasa-slot-date-card">
                      <div className="rasa-slot-date-header">
                        <span className="rasa-slot-date-icon">📅</span>
                        <span className="rasa-slot-date-text">
                          {formatDate(dateSlot.date)}
                        </span>
                      </div>
                      <div className="rasa-slot-times-list">
                        {dateSlot.slots.map((time, timeIndex) => (
                          <div key={timeIndex} className="rasa-slot-time-item">
                            <span className="rasa-slot-time-icon">🕐</span>
                            <span className="rasa-slot-time-text">{time}</span>
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(dateIndex, timeIndex)}
                              className="rasa-slot-remove-btn"
                              title="Remove slot"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rasa-form-actions">
              <button
                type="button"
                className="rasa-btn-cancel"
                onClick={() => setShowEditModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rasa-btn-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="rasa-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="rasa-btn-icon">✓</span>
                    Update Doctor
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ManageDoctors;
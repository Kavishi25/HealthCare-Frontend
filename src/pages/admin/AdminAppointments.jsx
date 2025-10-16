import React, { useState, useEffect } from 'react';
import AdminLayout from '../admin/AdminLayout';
import { appointmentService } from '../../services/appointmentSevice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/dateFormatter';
import { getStatusColor } from '../../utils/validators';
import '../../styles/AdminAppointments.css';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Fetch all appointments
  const fetchAllAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/appointments/all');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      alert('✅ Status updated successfully!');
      setShowDetailsModal(false);
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  // Handle delete appointment
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete appointment');

      setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
      alert('✅ Appointment deleted successfully!');
      setShowDetailsModal(false);
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  // Filter and search appointments
  const filteredAppointments = appointments
    .filter(apt => {
      if (filter !== 'all' && apt.status !== filter) return false;
      
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          apt.patient?.name?.toLowerCase().includes(search) ||
          apt.doctor?.name?.toLowerCase().includes(search) ||
          apt.status?.toLowerCase().includes(search)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

  const stats = {
    total: appointments.length,
    booked: appointments.filter(a => a.status === 'Booked').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  return (
    <AdminLayout>
      <div className="rasa-admin-appointments-page">
        {/* Header Section */}
        <div className="rasa-appointments-header-section">
          <div className="rasa-appointments-header-content">
            <div className="rasa-appointments-title-group">
              <div className="rasa-appointments-badge">Admin Dashboard</div>
              <h1 className="rasa-appointments-title">Appointments Management</h1>
              <p className="rasa-appointments-subtitle">
                Monitor and manage all patient appointments
              </p>
            </div>
            <button 
              className="rasa-appointments-refresh-btn"
              onClick={fetchAllAppointments}
            >
              <span className="rasa-btn-icon">🔄</span>
              <span className="rasa-btn-text">Refresh Data</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="rasa-appointments-search-container">
            <div className="rasa-appointments-search-wrapper">
              <span className="rasa-appointments-search-icon">🔍</span>
              <input
                type="text"
                className="rasa-appointments-search-input"
                placeholder="Search by patient name, doctor, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="rasa-appointments-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="rasa-appointments-stats-grid">
          <div className="rasa-appointments-stat-card rasa-stat-total">
            <div className="rasa-stat-icon-box">
              <span className="rasa-stat-emoji">📊</span>
            </div>
            <div className="rasa-stat-content">
              <div className="rasa-stat-value">{stats.total}</div>
              <div className="rasa-stat-label">Total Appointments</div>
            </div>
            <div className="rasa-stat-trend">100%</div>
          </div>
          
          <div className="rasa-appointments-stat-card rasa-stat-booked">
            <div className="rasa-stat-icon-box">
              <span className="rasa-stat-emoji">📅</span>
            </div>
            <div className="rasa-stat-content">
              <div className="rasa-stat-value">{stats.booked}</div>
              <div className="rasa-stat-label">Booked</div>
            </div>
            <div className="rasa-stat-trend">
              {stats.total > 0 ? Math.round((stats.booked / stats.total) * 100) : 0}%
            </div>
          </div>
          
          <div className="rasa-appointments-stat-card rasa-stat-completed">
            <div className="rasa-stat-icon-box">
              <span className="rasa-stat-emoji">✓</span>
            </div>
            <div className="rasa-stat-content">
              <div className="rasa-stat-value">{stats.completed}</div>
              <div className="rasa-stat-label">Completed</div>
            </div>
            <div className="rasa-stat-trend">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
          </div>
          
          <div className="rasa-appointments-stat-card rasa-stat-cancelled">
            <div className="rasa-stat-icon-box">
              <span className="rasa-stat-emoji">✕</span>
            </div>
            <div className="rasa-stat-content">
              <div className="rasa-stat-value">{stats.cancelled}</div>
              <div className="rasa-stat-label">Cancelled</div>
            </div>
            <div className="rasa-stat-trend">
              {stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="rasa-appointments-filter-container">
          <div className="rasa-appointments-filter-tabs">
            <button
              className={`rasa-appointments-filter-tab ${filter === 'all' ? 'rasa-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <span className="rasa-tab-label">All</span>
              <span className="rasa-tab-count">{stats.total}</span>
            </button>
            <button
              className={`rasa-appointments-filter-tab ${filter === 'Booked' ? 'rasa-active' : ''}`}
              onClick={() => setFilter('Booked')}
            >
              <span className="rasa-tab-label">Booked</span>
              <span className="rasa-tab-count">{stats.booked}</span>
            </button>
            <button
              className={`rasa-appointments-filter-tab ${filter === 'Completed' ? 'rasa-active' : ''}`}
              onClick={() => setFilter('Completed')}
            >
              <span className="rasa-tab-label">Completed</span>
              <span className="rasa-tab-count">{stats.completed}</span>
            </button>
            <button
              className={`rasa-appointments-filter-tab ${filter === 'Cancelled' ? 'rasa-active' : ''}`}
              onClick={() => setFilter('Cancelled')}
            >
              <span className="rasa-tab-label">Cancelled</span>
              <span className="rasa-tab-count">{stats.cancelled}</span>
            </button>
          </div>
          
          <div className="rasa-appointments-results-info">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="rasa-appointments-loading-wrapper">
            <LoadingSpinner message="Loading appointments..." />
          </div>
        )}
        
        {error && (
          <div className="rasa-appointments-error-wrapper">
            <ErrorMessage message={error} onRetry={fetchAllAppointments} />
          </div>
        )}

        {/* Appointments Table */}
        {!loading && !error && (
          <>
            {filteredAppointments.length > 0 ? (
              <div className="rasa-appointments-table-container">
                <div className="rasa-appointments-table-wrapper">
                  <table className="rasa-appointments-table">
                    <thead className="rasa-appointments-table-head">
                      <tr>
                        <th className="rasa-appointments-th">
                          <div className="rasa-th-content">
                            <span>Patient</span>
                          </div>
                        </th>
                        <th className="rasa-appointments-th">
                          <div className="rasa-th-content">
                            <span>Doctor</span>
                          </div>
                        </th>
                        <th 
                          className="rasa-appointments-th rasa-sortable"
                          onClick={() => handleSort('date')}
                        >
                          <div className="rasa-th-content">
                            <span>Date</span>
                            <span className="rasa-sort-icon">
                              {sortConfig.key === 'date' 
                                ? (sortConfig.direction === 'asc' ? '↑' : '↓')
                                : '↕'}
                            </span>
                          </div>
                        </th>
                        <th className="rasa-appointments-th">
                          <div className="rasa-th-content">
                            <span>Time</span>
                          </div>
                        </th>
                        <th className="rasa-appointments-th">
                          <div className="rasa-th-content">
                            <span>Status</span>
                          </div>
                        </th>
                        <th className="rasa-appointments-th rasa-appointments-th-actions">
                          <div className="rasa-th-content">
                            <span>Actions</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="rasa-appointments-table-body">
                      {filteredAppointments.map((appointment) => (
                        <tr 
                          key={appointment._id}
                          className="rasa-appointments-table-row"
                        >
                          <td className="rasa-appointments-td">
                            <div className="rasa-patient-cell">
                              <div className="rasa-patient-avatar">
                                {appointment.patient?.name?.charAt(0).toUpperCase() || 'N'}
                              </div>
                              <div className="rasa-patient-info">
                                <div className="rasa-patient-name">
                                  {appointment.patient?.name || 'N/A'}
                                </div>
                                <div className="rasa-patient-id">
                                  ID: {appointment.patient?._id?.slice(-6) || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="rasa-appointments-td">
                            <div className="rasa-doctor-cell">
                              <span className="rasa-doctor-icon">👨‍⚕️</span>
                              <span className="rasa-doctor-name">
                                Dr. {appointment.doctor?.name || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="rasa-appointments-td">
                            <div className="rasa-date-cell">
                              <span className="rasa-date-icon">📅</span>
                              <span className="rasa-date-text">
                                {formatDate(appointment.date)}
                              </span>
                            </div>
                          </td>
                          <td className="rasa-appointments-td">
                            <div className="rasa-time-cell">
                              <span className="rasa-time-icon">🕐</span>
                              <span className="rasa-time-text">
                                {appointment.slot}
                              </span>
                            </div>
                          </td>
                          <td className="rasa-appointments-td">
                            <span 
                              className={`rasa-appointments-status-badge rasa-status-${appointment.status.toLowerCase()}`}
                            >
                              {appointment.status}
                            </span>
                          </td>
                          <td className="rasa-appointments-td rasa-appointments-td-actions">
                            <button 
                              className="rasa-appointments-view-btn"
                              onClick={() => viewAppointmentDetails(appointment)}
                            >
                              <span className="rasa-btn-icon">👁️</span>
                              <span className="rasa-btn-text">View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rasa-appointments-empty-state">
                <div className="rasa-empty-icon">
                  {searchTerm || filter !== 'all' ? '🔍' : '📋'}
                </div>
                <h3 className="rasa-empty-title">
                  {searchTerm || filter !== 'all' 
                    ? 'No Appointments Found' 
                    : 'No Appointments Yet'}
                </h3>
                <p className="rasa-empty-message">
                  {searchTerm 
                    ? `No appointments match "${searchTerm}"`
                    : filter !== 'all'
                    ? `No ${filter.toLowerCase()} appointments found`
                    : 'Appointments will appear here once patients book them'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Appointment Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Appointment Details"
          size="medium"
        >
          {selectedAppointment && (
            <div className="rasa-appointment-details">
              <div className="rasa-details-section">
                <h3 className="rasa-details-section-title">
                  <span className="rasa-section-icon">👤</span>
                  Patient Information
                </h3>
                <div className="rasa-details-grid">
                  <div className="rasa-detail-item">
                    <span className="rasa-detail-label">Name</span>
                    <span className="rasa-detail-value">
                      {selectedAppointment.patient?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="rasa-detail-item">
                    <span className="rasa-detail-label">Patient ID</span>
                    <span className="rasa-detail-value">
                      {selectedAppointment.patient?._id || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rasa-details-section">
                <h3 className="rasa-details-section-title">
                  <span className="rasa-section-icon">👨‍⚕️</span>
                  Doctor Information
                </h3>
                <div className="rasa-details-grid">
                  <div className="rasa-detail-item">
                    <span className="rasa-detail-label">Name</span>
                    <span className="rasa-detail-value">
                      Dr. {selectedAppointment.doctor?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="rasa-detail-item">
                    <span className="rasa-detail-label">Specialty</span>
                    <span className="rasa-detail-value">
                      {selectedAppointment.doctor?.specialty || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rasa-details-section">
                <h3 className="rasa-details-section-title">
                  <span className="rasa-section-icon">📅</span>
                  Appointment Details
                </h3>
                <div className="rasa-details-grid">
                  <div className="rasa-detail-item">
                    <span className="rasa-detail-label">Date</span>
                    <span className="rasa-detail-value">
                      {formatDate(selectedAppointment.date)}
                    </span>
                  </div>
                  <div className="rasa-detail-item">
                    <span className="rasa-detail-label">Time</span>
                    <span className="rasa-detail-value">
                      {selectedAppointment.slot}
                    </span>
                  </div>
                  <div className="rasa-detail-item">
                    <span className="rasa-detail-label">Status</span>
                    <span 
                      className={`rasa-appointments-status-badge rasa-status-${selectedAppointment.status.toLowerCase()}`}
                    >
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div className="rasa-detail-item">
                    <span className="rasa-detail-label">Appointment ID</span>
                    <span className="rasa-detail-value rasa-detail-id">
                      {selectedAppointment._id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="rasa-details-section">
                <h3 className="rasa-details-section-title">
                  <span className="rasa-section-icon">⚙️</span>
                  Update Status
                </h3>
                <div className="rasa-status-actions">
                  {selectedAppointment.status !== 'Completed' && (
                    <button
                      className="rasa-status-action-btn rasa-btn-complete"
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'Completed')}
                    >
                      <span className="rasa-btn-icon">✓</span>
                      Mark as Completed
                    </button>
                  )}
                  {selectedAppointment.status !== 'Cancelled' && (
                    <button
                      className="rasa-status-action-btn rasa-btn-cancel"
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'Cancelled')}
                    >
                      <span className="rasa-btn-icon">✕</span>
                      Cancel Appointment
                    </button>
                  )}
                  {selectedAppointment.status !== 'Booked' && (
                    <button
                      className="rasa-status-action-btn rasa-btn-rebook"
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'Booked')}
                    >
                      <span className="rasa-btn-icon">📅</span>
                      Mark as Booked
                    </button>
                  )}
                </div>
              </div>

              {/* Delete Action */}
              <div className="rasa-details-danger-zone">
                <h4 className="rasa-danger-zone-title">Danger Zone</h4>
                <button
                  className="rasa-delete-appointment-btn"
                  onClick={() => handleDeleteAppointment(selectedAppointment._id)}
                >
                  <span className="rasa-btn-icon">🗑️</span>
                  Delete Appointment
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;
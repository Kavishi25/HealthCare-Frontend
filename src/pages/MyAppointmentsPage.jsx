import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../hooks/useAppointments';
import AppointmentList from '../components/appointment/AppointmentList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import '../styles/MyAppointmentPage.css';

const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  
  // Get patient ID from localStorage or auth context
  const patientId = localStorage.getItem('patientId') || '507f1f77bcf86cd799439011';
  
  const { 
    appointments, 
    loading, 
    error, 
    refetch, 
    cancelAppointment,
    getStatistics 
  } = useAppointments(patientId);

  // Local state for filtering
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get appointment statistics
  const stats = getStatistics();

  /**
   * Navigate to book appointment page
   */
  const handleBookNew = () => {
    navigate('/book-appointment');
  };

  /**
   * Handle refresh with animation
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  /**
   * Filter appointments based on active filter
   */
  const getFilteredAppointments = () => {
    if (activeFilter === 'all') return appointments;
    return appointments.filter(apt => apt.status.toLowerCase() === activeFilter);
  };

  const filteredAppointments = getFilteredAppointments();

  /**
   * Filter configuration
   */
  const filters = [
    { id: 'all', label: 'All', count: stats.total, icon: '📋' },
    { id: 'upcoming', label: 'Upcoming', count: stats.upcoming, icon: '📅' },
    { id: 'completed', label: 'Completed', count: stats.completed, icon: '✓' },
    { id: 'cancelled', label: 'Cancelled', count: stats.cancelled, icon: '✕' }
  ];

  return (
    <div className="rasa-my-appointments-page">
      <div className="rasa-appointments-container">
        {/* Back Button */}
        <button className="rasa-back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Page Header with Floating Effect */}
        <div className="rasa-appointments-header">
          <div className="rasa-header-content">
            <div className="rasa-header-badge">Your Healthcare Journey</div>
            <h1 className="rasa-appointments-title">My Appointments</h1>
            <p className="rasa-appointments-subtitle">
              View and manage all your scheduled appointments in one place
            </p>
          </div>
          <div className="rasa-header-actions">
            <button 
              className={`rasa-refresh-btn ${isRefreshing ? 'rasa-refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              aria-label="Refresh appointments"
            >
              <span className="rasa-refresh-icon">🔄</span>
              <span className="rasa-btn-text">Refresh</span>
            </button>
            <button 
              className="rasa-view-payments-btn" 
              onClick={() => navigate('/payments')}
            >
              <span className="rasa-payment-icon">💳</span>
              <span className="rasa-btn-text">View Payments</span>
            </button>
            <button 
              className="rasa-book-new-btn" 
              onClick={handleBookNew}
            >
              <span className="rasa-book-icon">+</span>
              <span className="rasa-btn-text">Book New</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards with Hover Effects */}
        {!loading && !error && appointments.length > 0 && (
          <div className="rasa-stats-section">
            <div 
              className={`rasa-stat-card rasa-stat-total ${activeFilter === 'all' ? 'rasa-stat-active' : ''}`}
              onClick={() => setActiveFilter('all')}
              role="button"
              tabIndex={0}
            >
              <div className="rasa-stat-icon-wrapper">
                <div className="rasa-stat-icon">📊</div>
              </div>
              <div className="rasa-stat-content">
                <div className="rasa-stat-value">{stats.total}</div>
                <div className="rasa-stat-label">Total</div>
              </div>
              <div className="rasa-stat-trend">View all</div>
            </div>
            
            <div 
              className={`rasa-stat-card rasa-stat-upcoming ${activeFilter === 'upcoming' ? 'rasa-stat-active' : ''}`}
              onClick={() => setActiveFilter('upcoming')}
              role="button"
              tabIndex={0}
            >
              <div className="rasa-stat-icon-wrapper">
                <div className="rasa-stat-icon">📅</div>
              </div>
              <div className="rasa-stat-content">
                <div className="rasa-stat-value">{stats.upcoming}</div>
                <div className="rasa-stat-label">Upcoming</div>
              </div>
              <div className="rasa-stat-trend">Next visits</div>
            </div>
            
            <div 
              className={`rasa-stat-card rasa-stat-completed ${activeFilter === 'completed' ? 'rasa-stat-active' : ''}`}
              onClick={() => setActiveFilter('completed')}
              role="button"
              tabIndex={0}
            >
              <div className="rasa-stat-icon-wrapper">
                <div className="rasa-stat-icon">✓</div>
              </div>
              <div className="rasa-stat-content">
                <div className="rasa-stat-value">{stats.completed}</div>
                <div className="rasa-stat-label">Completed</div>
              </div>
              <div className="rasa-stat-trend">Past visits</div>
            </div>
            
            <div 
              className={`rasa-stat-card rasa-stat-cancelled ${activeFilter === 'cancelled' ? 'rasa-stat-active' : ''}`}
              onClick={() => setActiveFilter('cancelled')}
              role="button"
              tabIndex={0}
            >
              <div className="rasa-stat-icon-wrapper">
                <div className="rasa-stat-icon">✕</div>
              </div>
              <div className="rasa-stat-content">
                <div className="rasa-stat-value">{stats.cancelled}</div>
                <div className="rasa-stat-label">Cancelled</div>
              </div>
              <div className="rasa-stat-trend">Archived</div>
            </div>
          </div>
        )}

        {/* Filter Tabs (Mobile-Friendly) */}
        {!loading && !error && appointments.length > 0 && (
          <div className="rasa-filter-tabs">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`rasa-filter-tab ${activeFilter === filter.id ? 'rasa-filter-active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span className="rasa-filter-icon">{filter.icon}</span>
                <span className="rasa-filter-label">{filter.label}</span>
                <span className="rasa-filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Loading State with Better Animation */}
        {loading && (
          <div className="rasa-loading-wrapper">
            <LoadingSpinner message="Loading your appointments..." />
          </div>
        )}
        
        {/* Error State with Retry */}
        {error && (
          <div className="rasa-error-wrapper">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        )}

        {/* Appointments List with Filter Info */}
        {!loading && !error && filteredAppointments.length > 0 && (
          <div className="rasa-appointments-content">
            <div className="rasa-content-header">
              <h2 className="rasa-content-title">
                {activeFilter === 'all' ? 'All Appointments' : `${filters.find(f => f.id === activeFilter)?.label} Appointments`}
              </h2>
              <span className="rasa-content-count">
                {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'}
              </span>
            </div>
            <AppointmentList
              appointments={filteredAppointments}
              onCancel={cancelAppointment}
              loading={false}
            />
          </div>
        )}

        {/* Empty State - No Appointments in Filter */}
        {!loading && !error && appointments.length > 0 && filteredAppointments.length === 0 && (
          <div className="rasa-empty-filter-state">
            <div className="rasa-empty-filter-icon">🔍</div>
            <h3 className="rasa-empty-filter-title">No {activeFilter} appointments</h3>
            <p className="rasa-empty-filter-text">
              You don't have any {activeFilter} appointments at the moment.
            </p>
            <button 
              className="rasa-filter-reset-btn" 
              onClick={() => setActiveFilter('all')}
            >
              View All Appointments
            </button>
          </div>
        )}

        {/* Empty State - No Appointments at All */}
        {!loading && !error && appointments.length === 0 && (
          <div className="rasa-empty-state">
            <div className="rasa-empty-illustration">
              <div className="rasa-empty-icon-wrapper">
                <span className="rasa-empty-icon">📅</span>
              </div>
            </div>
            <h2 className="rasa-empty-title">No Appointments Yet</h2>
            <p className="rasa-empty-text">
              Start your healthcare journey by booking your first appointment with our expert doctors.
            </p>
            <div className="rasa-empty-features">
              <div className="rasa-empty-feature">
                <span className="rasa-feature-icon">⚡</span>
                <span className="rasa-feature-text">Quick Booking</span>
              </div>
              <div className="rasa-empty-feature">
                <span className="rasa-feature-icon">👨‍⚕️</span>
                <span className="rasa-feature-text">Expert Doctors</span>
              </div>
              <div className="rasa-empty-feature">
                <span className="rasa-feature-icon">🔔</span>
                <span className="rasa-feature-text">Reminders</span>
              </div>
            </div>
            <button className="rasa-empty-book-btn" onClick={handleBookNew}>
              <span className="rasa-book-icon">+</span>
              Book Your First Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
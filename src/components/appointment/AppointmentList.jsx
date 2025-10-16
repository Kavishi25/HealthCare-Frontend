import React, { useState } from 'react';
import AppointmentCard from './AppointmentCard';
import '../../styles/AppointmentList.css';

/**
 * AppointmentList Component
 * Displays a filterable list of patient appointments
 * 
 * @param {Array} appointments - Array of appointment objects
 * @param {Function} onCancel - Callback function to cancel an appointment
 * @param {boolean} loading - Loading state
 */
const AppointmentList = ({ appointments, onCancel, loading }) => {
  const [filter, setFilter] = useState('all');

  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  // Calculate counts for each status
  const allCount = appointments.length;
  const upcomingCount = appointments.filter(a => a.status === 'Booked').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;

  // Handle filter tab click
  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
  };

  return (
    <div className="rasa-appointment-list-container">
      {/* Header with Filter Tabs */}
      <div className="rasa-list-header">
        <h2 className="rasa-list-title">My Appointments</h2>
        
        <div className="rasa-filter-tabs">
          <button
            className={`rasa-filter-tab ${filter === 'all' ? 'rasa-filter-active' : ''}`}
            onClick={() => handleFilterClick('all')}
            aria-pressed={filter === 'all'}
          >
            All <span className="rasa-tab-count">({allCount})</span>
          </button>
          
          <button
            className={`rasa-filter-tab ${filter === 'Booked' ? 'rasa-filter-active' : ''}`}
            onClick={() => handleFilterClick('Booked')}
            aria-pressed={filter === 'Booked'}
          >
            Upcoming <span className="rasa-tab-count">({upcomingCount})</span>
          </button>
          
          <button
            className={`rasa-filter-tab ${filter === 'Completed' ? 'rasa-filter-active' : ''}`}
            onClick={() => handleFilterClick('Completed')}
            aria-pressed={filter === 'Completed'}
          >
            Completed <span className="rasa-tab-count">({completedCount})</span>
          </button>
          
          <button
            className={`rasa-filter-tab ${filter === 'Cancelled' ? 'rasa-filter-active' : ''}`}
            onClick={() => handleFilterClick('Cancelled')}
            aria-pressed={filter === 'Cancelled'}
          >
            Cancelled <span className="rasa-tab-count">({cancelledCount})</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="rasa-list-loading">
          <div className="rasa-loading-spinner"></div>
          <p>Loading appointments...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAppointments.length === 0 && (
        <div className="rasa-list-empty">
          <div className="rasa-empty-icon">📅</div>
          <h3 className="rasa-empty-title">No appointments found</h3>
          <p className="rasa-empty-text">
            {filter === 'all' 
              ? "You haven't booked any appointments yet."
              : `You don't have any ${filter.toLowerCase()} appointments.`}
          </p>
        </div>
      )}

      {/* Appointments Grid */}
      {!loading && filteredAppointments.length > 0 && (
        <div className="rasa-appointments-grid">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {!loading && filteredAppointments.length > 0 && (
        <div className="rasa-list-summary">
          Showing {filteredAppointments.length} of {allCount} appointment{allCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
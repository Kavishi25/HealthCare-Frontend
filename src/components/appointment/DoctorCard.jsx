import React from 'react';
import '../../styles/DoctorCard.css';

/**
 * DoctorCard Component
 * Displays individual doctor information with selection capability
 * 
 * @param {Object} doctor - Doctor object with name, specialty, availableSlots
 * @param {Function} onSelect - Callback function when doctor is selected
 * @param {boolean} isSelected - Whether this doctor is currently selected
 */
const DoctorCard = ({ doctor, onSelect, isSelected }) => {
  // Get first letter for avatar
  const avatarInitial = doctor.name.charAt(0).toUpperCase();
  
  // Count available dates
  const availableDatesCount = doctor.availableSlots?.length || 0;
  
  // Calculate total available slots across all dates
  const totalSlotsCount = doctor.availableSlots?.reduce((total, dateSlot) => {
    return total + (dateSlot.slots?.length || 0);
  }, 0) || 0;

  const handleClick = () => {
    onSelect(doctor);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(doctor);
    }
  };

  return (
    <div 
      className={`rasa-doctor-card ${isSelected ? 'rasa-doctor-card-selected' : ''}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select Dr. ${doctor.name}, ${doctor.specialty}`}
    >
      {/* Doctor Avatar */}
      <div className="rasa-doctor-avatar">
        <span className="rasa-doctor-initial">{avatarInitial}</span>
      </div>
      
      {/* Doctor Information */}
      <div className="rasa-doctor-info">
        <h3 className="rasa-doctor-name">Dr. {doctor.name}</h3>
        
        <p className="rasa-doctor-specialty">
          <span className="rasa-specialty-badge">{doctor.specialty}</span>
        </p>
        
        {/* Availability Information */}
        {availableDatesCount > 0 ? (
          <div className="rasa-doctor-availability">
            <span className="rasa-availability-icon">📅</span>
            <span className="rasa-availability-text">
              {availableDatesCount} available date{availableDatesCount !== 1 ? 's' : ''}
              {totalSlotsCount > 0 && (
                <span className="rasa-slots-count"> • {totalSlotsCount} slots</span>
              )}
            </span>
          </div>
        ) : (
          <div className="rasa-doctor-availability rasa-no-availability">
            <span className="rasa-availability-icon">⚠️</span>
            <span className="rasa-availability-text">No slots available</span>
          </div>
        )}
      </div>
      
      {/* Selection Button */}
      <div className="rasa-doctor-action">
        <button 
          className={`rasa-select-btn ${isSelected ? 'rasa-select-btn-active' : ''}`}
          aria-label={isSelected ? 'Doctor selected' : 'Select doctor'}
        >
          {isSelected ? (
            <>
              <span className="rasa-btn-icon">✓</span> Selected
            </>
          ) : (
            'Select'
          )}
        </button>
      </div>

      {/* Selected Indicator Badge */}
      {isSelected && (
        <div className="rasa-selected-badge">
          <span>✓</span>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;
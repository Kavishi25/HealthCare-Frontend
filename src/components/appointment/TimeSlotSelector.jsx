import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentSevice';
import { formatDate, getMinDate, getMaxDate } from '../../utils/dateFormatter';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import AlternativeSlots from './AlternativeSlots';
import '../../styles/TimeSlotSelector.css';

/**
 * TimeSlotSelector Component
 * Allows users to select date and time slot for appointment booking
 * Shows alternative dates if selected date has no availability
 * 
 * @param {Object} doctor - Selected doctor object
 * @param {Function} onSlotSelect - Callback when slot is selected (date, slot)
 * @param {string} selectedDate - Currently selected date
 * @param {string} selectedSlot - Currently selected slot
 */
const TimeSlotSelector = ({ doctor, onSlotSelect, selectedDate, selectedSlot }) => {
  const [date, setDate] = useState(selectedDate || '');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedSlotState, setSelectedSlotState] = useState(selectedSlot || null);

  // Fetch available slots when date changes
  useEffect(() => {
    if (date && doctor) {
      fetchAvailableSlots();
    }
  }, [date, doctor]);

  // Fetch available slots from API
  const fetchAvailableSlots = async () => {
    setLoading(true);
    setError(null);
    setSelectedSlotState(null);
    setShowAlternatives(false);
    
    try {
      const response = await appointmentService.getAvailableSlots(doctor._id, date);
      setAvailableSlots(response.available || []);
      
      // Show alternatives if no slots available
      if (!response.available || response.available.length === 0) {
        setShowAlternatives(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch available slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setSelectedSlotState(null);
  };

  // Handle slot selection
  const handleSlotClick = (slot) => {
    setSelectedSlotState(slot);
    onSlotSelect(date, slot);
  };

  // Handle alternative slot selection
  const handleAlternativeSelect = (altDate, altSlot) => {
    setDate(altDate);
    setSelectedSlotState(altSlot);
    setShowAlternatives(false);
    onSlotSelect(altDate, altSlot);
  };

  // Show message if no doctor selected
  if (!doctor) {
    return (
      <div className="rasa-timeslot-empty">
        <div className="rasa-empty-icon">📅</div>
        <p className="rasa-empty-message">Please select a doctor first</p>
      </div>
    );
  }

  return (
    <div className="rasa-timeslot-container">
      <h3 className="rasa-timeslot-title">Select Date & Time</h3>
      <p className="rasa-timeslot-subtitle">
        Choose an available date and time slot for your appointment with Dr. {doctor.name}
      </p>
      
      {/* Date Selector */}
      <div className="rasa-date-selector">
        <label className="rasa-date-label" htmlFor="appointment-date">
          Select Date:
        </label>
        <input
          id="appointment-date"
          type="date"
          className="rasa-date-input"
          value={date}
          onChange={handleDateChange}
          min={getMinDate()}
          max={getMaxDate()}
          aria-label="Select appointment date"
        />
      </div>

      {date && (
        <>
          {/* Loading State */}
          {loading && <LoadingSpinner message="Loading available slots..." />}
          
          {/* Error State */}
          {error && <ErrorMessage message={error} onRetry={fetchAvailableSlots} />}
          
          {/* Available Slots Grid */}
          {!loading && !error && availableSlots.length > 0 && (
            <div className="rasa-slots-section">
              <p className="rasa-slots-date">
                <span className="rasa-slots-icon">📅</span>
                Available slots for <strong>{formatDate(date)}</strong>:
              </p>
              <div className="rasa-slots-grid">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`rasa-slot-btn ${selectedSlotState === slot ? 'rasa-slot-selected' : ''}`}
                    onClick={() => handleSlotClick(slot)}
                    aria-pressed={selectedSlotState === slot}
                    aria-label={`Select time slot ${slot}`}
                  >
                    <span className="rasa-slot-time">{slot}</span>
                    {selectedSlotState === slot && (
                      <span className="rasa-slot-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="rasa-slots-hint">
                💡 Click on a time slot to select it
              </p>
            </div>
          )}
          
          {/* No Slots Available */}
          {!loading && !error && availableSlots.length === 0 && (
            <div className="rasa-no-slots">
              <div className="rasa-no-slots-icon">😔</div>
              <p className="rasa-no-slots-text">
                No slots available for {formatDate(date)}
              </p>
              <p className="rasa-no-slots-subtitle">
                All time slots are booked. Please check alternative dates below.
              </p>
            </div>
          )}

          {/* Alternative Slots Component */}
          {showAlternatives && !loading && (
            <AlternativeSlots
              doctor={doctor}
              currentDate={date}
              onSelectAlternative={handleAlternativeSelect}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TimeSlotSelector;
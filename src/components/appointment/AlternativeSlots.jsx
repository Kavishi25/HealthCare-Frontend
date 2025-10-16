import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentSevice';
import { formatDate, formatDateForInput } from '../../utils/dateFormatter';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AlternativeSlots.css';

/**
 * AlternativeSlots Component
 * Suggests alternative dates when selected date has no availability
 * Searches next 7 days and shows up to 3 alternative dates
 * 
 * @param {Object} doctor - Doctor object
 * @param {string} currentDate - Currently selected date
 * @param {Function} onSelectAlternative - Callback when alternative is selected (date, slot)
 */
const AlternativeSlots = ({ doctor, currentDate, onSelectAlternative }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find alternative slots on mount
  useEffect(() => {
    findAlternativeSlots();
  }, [doctor, currentDate]);

  // Search for alternative available dates
  const findAlternativeSlots = async () => {
    setLoading(true);
    const alternativeOptions = [];
    
    try {
      // Check next 7 days for available slots
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
      
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() + i);
        const dateString = formatDateForInput(checkDate);
        
        try {
          const response = await appointmentService.getAvailableSlots(doctor._id, dateString);
          
          if (response.available && response.available.length > 0) {
            alternativeOptions.push({
              date: dateString,
              slots: response.available,
              dayName: checkDate.toLocaleDateString('en-US', { weekday: 'long' })
            });
            
            // Stop after finding 3 alternative dates
            if (alternativeOptions.length >= 3) break;
          }
        } catch (err) {
          console.error(`Error checking date ${dateString}:`, err);
        }
      }
      
      setAlternatives(alternativeOptions);
    } catch (err) {
      console.error('Error finding alternatives:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="rasa-alternatives-loading">
        <LoadingSpinner message="Finding alternative slots..." />
      </div>
    );
  }

  // No alternatives found
  if (alternatives.length === 0) {
    return (
      <div className="rasa-alternatives-empty">
        <div className="rasa-alternatives-empty-icon">📭</div>
        <p className="rasa-alternatives-empty-text">
          No alternative slots found in the next 7 days.
        </p>
        <p className="rasa-alternatives-empty-hint">
          Please try selecting a different doctor or check back later.
        </p>
      </div>
    );
  }

  // Display alternatives
  return (
    <div className="rasa-alternatives-container">
      <h4 className="rasa-alternatives-title">
        <span className="rasa-alternatives-icon">💡</span>
        Alternative Available Dates
      </h4>
      <p className="rasa-alternatives-description">
        Here are some upcoming dates with available slots:
      </p>
      
      <div className="rasa-alternatives-list">
        {alternatives.map((alt) => (
          <div key={alt.date} className="rasa-alternative-card">
            <div className="rasa-alternative-header">
              <div className="rasa-alternative-date">
                <span className="rasa-alternative-day">{alt.dayName}</span>
                <span className="rasa-alternative-full-date">{formatDate(alt.date)}</span>
              </div>
              <span className="rasa-alternative-count">
                {alt.slots.length} slot{alt.slots.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="rasa-alternative-slots">
              {alt.slots.slice(0, 4).map((slot) => (
                <button
                  key={slot}
                  className="rasa-alternative-slot-btn"
                  onClick={() => onSelectAlternative(alt.date, slot)}
                  aria-label={`Select ${slot} on ${formatDate(alt.date)}`}
                >
                  <span className="rasa-alt-slot-time">{slot}</span>
                  <span className="rasa-alt-slot-arrow">→</span>
                </button>
              ))}
              {alt.slots.length > 4 && (
                <span className="rasa-more-slots">
                  +{alt.slots.length - 4} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlternativeSlots;
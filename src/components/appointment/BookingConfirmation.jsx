import React, { useState } from 'react';
import { formatDate } from '../../utils/dateFormatter';
import Modal from '../common/Modal';
import '../../styles/BookingConfirmation.css';

/**
 * BookingConfirmation Component
 * Modal dialog for confirming appointment booking
 * Shows appointment summary and requires terms acceptance
 * 
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {Object} doctor - Selected doctor object
 * @param {string} date - Selected date
 * @param {string} slot - Selected time slot
 * @param {Function} onConfirm - Callback when booking is confirmed
 * @param {boolean} loading - Loading state during booking
 */
const BookingConfirmation = ({ 
  isOpen, 
  onClose, 
  doctor, 
  date, 
  slot, 
  onConfirm,
  loading 
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Handle confirmation click
  const handleConfirm = () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
    onConfirm();
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setAcceptedTerms(false);
      onClose();
    }
  };

  // Handle terms checkbox change
  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Appointment" size="medium">
      <div className="rasa-confirmation-content">
        {/* Success Icon */}
        <div className="rasa-confirmation-icon">✓</div>
        
        <h3 className="rasa-confirmation-subtitle">
          Please review your appointment details
        </h3>
        
        {/* Appointment Details */}
        <div className="rasa-confirmation-details">
          <div className="rasa-detail-row">
            <span className="rasa-detail-icon">👨‍⚕️</span>
            <div className="rasa-detail-content">
              <span className="rasa-detail-label">Doctor</span>
              <span className="rasa-detail-value">Dr. {doctor?.name}</span>
            </div>
          </div>
          
          <div className="rasa-detail-row">
            <span className="rasa-detail-icon">🏥</span>
            <div className="rasa-detail-content">
              <span className="rasa-detail-label">Specialty</span>
              <span className="rasa-detail-value">{doctor?.specialty}</span>
            </div>
          </div>
          
          <div className="rasa-detail-row">
            <span className="rasa-detail-icon">📅</span>
            <div className="rasa-detail-content">
              <span className="rasa-detail-label">Date</span>
              <span className="rasa-detail-value">{formatDate(date)}</span>
            </div>
          </div>
          
          <div className="rasa-detail-row">
            <span className="rasa-detail-icon">🕐</span>
            <div className="rasa-detail-content">
              <span className="rasa-detail-label">Time</span>
              <span className="rasa-detail-value">{slot}</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="rasa-terms-section">
          <label className="rasa-terms-checkbox">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={handleTermsChange}
              disabled={loading}
              aria-label="Accept terms and conditions"
            />
            <span className="rasa-terms-text">
              I agree to the <a href="#" className="rasa-terms-link" onClick={(e) => e.preventDefault()}>terms and conditions</a> and 
              understand the cancellation policy
            </span>
          </label>
        </div>

        {/* Important Notice */}
        <div className="rasa-confirmation-notice">
          <span className="rasa-notice-icon">ℹ️</span>
          <span className="rasa-notice-text">
            Please arrive 10 minutes before your scheduled time
          </span>
        </div>

        {/* Action Buttons */}
        <div className="rasa-confirmation-actions">
          <button 
            className="rasa-cancel-confirm-btn" 
            onClick={handleClose}
            disabled={loading}
            aria-label="Cancel booking"
          >
            Cancel
          </button>
          <button 
            className="rasa-confirm-btn" 
            onClick={handleConfirm}
            disabled={loading || !acceptedTerms}
            aria-label="Confirm booking"
          >
            {loading ? (
              <>
                <span className="rasa-btn-spinner"></span>
                Booking...
              </>
            ) : (
              <>
                <span className="rasa-btn-check">✓</span>
                Confirm Booking
              </>
            )}
          </button>
        </div>

        {/* Loading Message */}
        {loading && (
          <p className="rasa-confirmation-note">
            ⏳ Please wait while we confirm your appointment...
          </p>
        )}
      </div>
    </Modal>
  );
};

export default BookingConfirmation;
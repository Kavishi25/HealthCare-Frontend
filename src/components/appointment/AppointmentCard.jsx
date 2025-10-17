import React, { useState } from 'react';
import { formatDate, getRelativeDate } from '../../utils/dateFormatter';
import { getStatusColor, canCancelAppointment } from '../../utils/validators';
import Modal from '../common/Modal';
import '../../styles/AppointmentCard.css';

/**
 * AppointmentCard Component
 * Displays individual appointment details with cancel functionality
 * 
 * @param {Object} appointment - Appointment object with doctor, date, slot, status
 * @param {Function} onCancel - Callback function to cancel the appointment
 */
const AppointmentCard = ({ appointment, onCancel }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Get doctor initial for avatar
  const doctorInitial = appointment.doctor?.name?.charAt(0).toUpperCase() || 'D';
  
  // Check if appointment can be cancelled
  const isCancellable = canCancelAppointment(appointment);

  // Handle cancel button click
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  // Handle cancel confirmation
  const handleConfirmCancel = async () => {
    setCancelling(true);
    const result = await onCancel(appointment._id);
    setCancelling(false);
    
    if (result.success) {
      setShowCancelModal(false);
    } else {
      alert(result.error || 'Failed to cancel appointment');
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    if (!cancelling) {
      setShowCancelModal(false);
    }
  };

  return (
    <>
      <div className="rasa-appointment-card">
        {/* Card Header with Doctor Info and Status */}
        <div className="rasa-appointment-header">
          <div className="rasa-appointment-doctor">
            <div className="rasa-doctor-avatar-small">
              {doctorInitial}
            </div>
            <div className="rasa-doctor-details">
              <h3 className="rasa-appointment-doctor-name">
                Dr. {appointment.doctor?.name || 'Unknown Doctor'}
              </h3>
              <p className="rasa-appointment-specialty">
                {appointment.doctor?.specialty || 'General'}
              </p>
            </div>
          </div>
          
          <span 
            className="rasa-appointment-status"
            style={{ backgroundColor: getStatusColor(appointment.status) }}
            aria-label={`Status: ${appointment.status}`}
          >
            {appointment.status}
          </span>
        </div>

        {/* Appointment Information */}
        <div className="rasa-appointment-info">
          {/* Date Information */}
          <div className="rasa-info-item">
            <span className="rasa-info-icon" aria-hidden="true">📅</span>
            <div className="rasa-info-content">
              <span className="rasa-info-label">Date</span>
              <span className="rasa-info-value">{formatDate(appointment.date)}</span>
              <span className="rasa-info-relative">{getRelativeDate(appointment.date)}</span>
            </div>
          </div>

          {/* Time Information */}
          <div className="rasa-info-item">
            <span className="rasa-info-icon" aria-hidden="true">🕐</span>
            <div className="rasa-info-content">
              <span className="rasa-info-label">Time</span>
              <span className="rasa-info-value">{appointment.slot}</span>
            </div>
          </div>

          {/* Consultation Fee */}
          {appointment.doctor?.chargePerSlot && (
            <div className="rasa-info-item">
              <span className="rasa-info-icon" aria-hidden="true">💵</span>
              <div className="rasa-info-content">
                <span className="rasa-info-label">Consultation Fee</span>
                <span className="rasa-info-value">LKR {appointment.doctor.chargePerSlot}</span>
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div className="rasa-info-item">
            <span className="rasa-info-icon" aria-hidden="true">💳</span>
            <div className="rasa-info-content">
              <span className="rasa-info-label">Payment Status</span>
              <span className={`rasa-info-value rasa-payment-status rasa-payment-${appointment.paymentStatus || 'unpaid'}`}>
                {(appointment.paymentStatus || 'unpaid').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Appointment ID */}
          <div className="rasa-info-item rasa-info-item-full">
            <span className="rasa-info-icon" aria-hidden="true">🔖</span>
            <div className="rasa-info-content">
              <span className="rasa-info-label">Appointment ID</span>
              <span className="rasa-info-value rasa-info-id">
                {appointment._id.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isCancellable && (
          <div className="rasa-appointment-actions">
            <button 
              className="rasa-cancel-appointment-btn"
              onClick={handleCancelClick}
              aria-label="Cancel this appointment"
            >
              <span className="rasa-btn-icon">✕</span> Cancel Appointment
            </button>
          </div>
        )}

        {/* Non-cancellable message */}
        {!isCancellable && appointment.status === 'Booked' && (
          <div className="rasa-appointment-note">
            <span className="rasa-note-icon">ℹ️</span>
            <span>This appointment cannot be cancelled as the date has passed.</span>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={handleCloseModal}
        title="Cancel Appointment"
        size="small"
      >
        <div className="rasa-cancel-modal-content">
          <div className="rasa-cancel-warning-icon">⚠️</div>
          
          <p className="rasa-cancel-warning">
            Are you sure you want to cancel this appointment?
          </p>
          
          <div className="rasa-cancel-details">
            <div className="rasa-cancel-detail-row">
              <strong>Doctor:</strong> Dr. {appointment.doctor?.name}
            </div>
            <div className="rasa-cancel-detail-row">
              <strong>Date:</strong> {formatDate(appointment.date)}
            </div>
            <div className="rasa-cancel-detail-row">
              <strong>Time:</strong> {appointment.slot}
            </div>
          </div>
          
          <p className="rasa-cancel-note">
            This action cannot be undone. You will need to book a new appointment if you change your mind.
          </p>

          <div className="rasa-cancel-modal-actions">
            <button
              className="rasa-keep-btn"
              onClick={handleCloseModal}
              disabled={cancelling}
            >
              Keep Appointment
            </button>
            <button
              className="rasa-confirm-cancel-btn"
              onClick={handleConfirmCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <span className="rasa-btn-spinner"></span> Cancelling...
                </>
              ) : (
                <>Yes, Cancel</>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AppointmentCard;
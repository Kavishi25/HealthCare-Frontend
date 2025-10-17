import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../hooks/useDoctors";
import { appointmentService } from "../services/appointmentSevice";
import { validateAppointmentBooking } from "../utils/validators";
import DoctorSearch from "../components/appointment/DoctorSearch";
import DoctorCard from "../components/appointment/DoctorCard";
import TimeSlotSelector from "../components/appointment/TimeSlotSelector";
import BookingConfirmation from "../components/appointment/BookingConfirmation";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "../styles/BookAppointmentPage.css";

/**
 * Enhanced BookAppointmentPage Component
 * Main page for booking doctor appointments with improved UI/UX
 * Allows users to search doctors, select time slots, and confirm bookings
 */
const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
    searchDoctors,
    getSpecialties,
  } = useDoctors();

  // Selection states
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Booking states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Get patient ID from localStorage or auth context
  const patientId =
    localStorage.getItem("patientId") || "507f1f77bcf86cd799439011";

  /**
   * Handle doctor selection with smooth scroll
   */
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedSlot("");
    setBookingError(null);

    // Scroll to time slot selector smoothly
    setTimeout(() => {
      const timeslotElement = document.querySelector(
        ".rasa-timeslot-container"
      );
      if (timeslotElement) {
        timeslotElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  /**
   * Handle time slot selection
   */
  const handleSlotSelect = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    setBookingError(null);
  };

  /**
   * Proceed to confirmation modal
   */
  const handleProceedToConfirm = () => {
    // Validate booking data
    const validation = validateAppointmentBooking({
      patientId,
      doctorId: selectedDoctor?._id,
      date: selectedDate,
      slot: selectedSlot,
    });

    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).join("\n");
      alert(errorMessages);
      return;
    }

    setShowConfirmation(true);
  };

  /**
   * Confirm and book appointment
   */
  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    setBookingError(null);

    try {
      const appointmentData = {
        patientId,
        doctorId: selectedDoctor._id,
        date: selectedDate,
        slot: selectedSlot,
      };

      const result = await appointmentService.bookAppointment(appointmentData);

      // Success! Close modal
      setShowConfirmation(false);

      // Show success notification
      alert(
        "✅ Appointment booked successfully!\n\nYou will be redirected to the payment page."
      );

      // Navigate to payment page with appointment data
      navigate("/payment", {
        state: {
          appointmentId: result.appointment?._id || result._id,
          doctor: selectedDoctor,
          date: selectedDate,
          slot: selectedSlot,
          amount: selectedDoctor.chargePerSlot || 0,
        },
      });
    } catch (err) {
      setBookingError(err.message || "Failed to book appointment");

      // If slot already booked, close modal and show error
      if (err.message && err.message.includes("already booked")) {
        setShowConfirmation(false);
        alert("⚠️ " + err.message + "\n\nPlease select a different time slot.");
        // Reset slot selection
        setSelectedSlot("");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Check if user can proceed to confirmation
  const canProceed = selectedDoctor && selectedDate && selectedSlot;

  // Calculate current step for breadcrumb
  const currentStep = !selectedDoctor
    ? 1
    : !selectedDate || !selectedSlot
    ? 2
    : 3;

  return (
    <div className="rasa-book-appointment-page">
      <div className="rasa-page-container">
        {/* Page Header */}
        <div className="rasa-page-header">
          <button className="rasa-back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="rasa-header-content">
            <h1 className="rasa-page-title">Book an Appointment</h1>
            <p className="rasa-page-subtitle">
              Find your doctor and schedule your visit in just a few clicks
            </p>
          </div>

          {/* Enhanced Progress Steps */}
          <div className="rasa-progress-steps">
            <div
              className={`rasa-step ${
                currentStep >= 1 ? "rasa-step-active" : ""
              }`}
            >
              <div className="rasa-step-number">1</div>
              <div className="rasa-step-label">Select Doctor</div>
              {currentStep > 1 && <div className="rasa-step-check">✓</div>}
            </div>
            <div className="rasa-step-connector"></div>
            <div
              className={`rasa-step ${
                currentStep >= 2 ? "rasa-step-active" : ""
              }`}
            >
              <div className="rasa-step-number">2</div>
              <div className="rasa-step-label">Choose Time</div>
              {currentStep > 2 && <div className="rasa-step-check">✓</div>}
            </div>
            <div className="rasa-step-connector"></div>
            <div
              className={`rasa-step ${
                currentStep >= 3 ? "rasa-step-active" : ""
              }`}
            >
              <div className="rasa-step-number">3</div>
              <div className="rasa-step-label">Confirm</div>
              {currentStep > 3 && <div className="rasa-step-check">✓</div>}
            </div>
          </div>
        </div>

        {/* Doctor Search Section */}
        <div className="rasa-search-wrapper">
          <DoctorSearch
            onSearch={searchDoctors}
            specialties={getSpecialties()}
          />
        </div>

        {/* Doctors Loading State */}
        {doctorsLoading && (
          <div className="rasa-loading-wrapper">
            <LoadingSpinner message="Loading doctors..." />
          </div>
        )}

        {/* Doctors Error State */}
        {doctorsError && (
          <div className="rasa-error-wrapper">
            <ErrorMessage message={doctorsError} />
          </div>
        )}

        {/* No Results State */}
        {!doctorsLoading && !doctorsError && doctors.length === 0 && (
          <div className="rasa-no-results">
            <div className="rasa-no-results-icon">🔍</div>
            <p className="rasa-no-results-text">
              No doctors found matching your search criteria.
            </p>
            <p className="rasa-no-results-hint">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}

        {/* Doctors List Section */}
        {!doctorsLoading && !doctorsError && doctors.length > 0 && (
          <div className="rasa-doctors-section">
            <div className="rasa-section-header">
              <h2 className="rasa-section-title">
                Available Doctors{" "}
                <span className="rasa-count-badge">({doctors.length})</span>
              </h2>
              {selectedDoctor && (
                <button
                  className="rasa-change-doctor-btn"
                  onClick={() => {
                    setSelectedDoctor(null);
                    setSelectedDate("");
                    setSelectedSlot("");
                  }}
                >
                  Change Doctor
                </button>
              )}
            </div>
            <div className="rasa-doctors-list">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onSelect={handleDoctorSelect}
                  isSelected={selectedDoctor?._id === doctor._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Time Slot Selector Section */}
        {selectedDoctor && (
          <div className="rasa-timeslot-section">
            <TimeSlotSelector
              doctor={selectedDoctor}
              onSlotSelect={handleSlotSelect}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
            />
          </div>
        )}

        {/* Booking Error Display */}
        {bookingError && (
          <div className="rasa-booking-error">
            <ErrorMessage message={bookingError} />
          </div>
        )}

        {/* Proceed to Confirmation Button */}
        {canProceed && (
          <div className="rasa-proceed-section">
            <div className="rasa-proceed-summary">
              <h3 className="rasa-summary-title">Booking Summary</h3>
              <div className="rasa-summary-details">
                <p>
                  <strong>Doctor:</strong> Dr. {selectedDoctor.name}
                </p>
                <p>
                  <strong>Specialty:</strong> {selectedDoctor.specialty}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  <strong>Time:</strong> {selectedSlot}
                </p>
                <p>
                  <strong>Consultation Fee:</strong> LKR{" "}
                  {selectedDoctor.chargePerSlot || 0}
                </p>
              </div>
            </div>
            <button
              className="rasa-proceed-btn"
              onClick={handleProceedToConfirm}
            >
              <span className="rasa-proceed-icon">✓</span>
              Proceed to Confirmation
            </button>
          </div>
        )}

        {/* Booking Confirmation Modal */}
        <BookingConfirmation
          isOpen={showConfirmation}
          onClose={() => !bookingLoading && setShowConfirmation(false)}
          doctor={selectedDoctor}
          date={selectedDate}
          slot={selectedSlot}
          onConfirm={handleConfirmBooking}
          loading={bookingLoading}
        />
      </div>
    </div>
  );
};

export default BookAppointmentPage;

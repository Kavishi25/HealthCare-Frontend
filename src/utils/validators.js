import { isDateInPast } from './dateFormatter';

/**
 * Validate appointment booking data
 * @param {Object} data - Appointment data to validate
 * @param {string} data.patientId - Patient ID
 * @param {string} data.doctorId - Doctor ID
 * @param {string} data.date - Appointment date
 * @param {string} data.slot - Time slot
 * @returns {Object} - Validation result with isValid boolean and errors object
 */
export const validateAppointmentBooking = (data) => {
  const errors = {};
  
  if (!data.patientId) {
    errors.patientId = 'Patient ID is required';
  }
  
  if (!data.doctorId) {
    errors.doctorId = 'Please select a doctor';
  }
  
  if (!data.date) {
    errors.date = 'Please select a date';
  } else if (isDateInPast(data.date)) {
    errors.date = 'Cannot book appointments in the past';
  }
  
  if (!data.slot) {
    errors.slot = 'Please select a time slot';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate doctor search input
 * @param {string} searchTerm - Search term to validate
 * @returns {Object} - Validation result
 */
export const validateSearchTerm = (searchTerm) => {
  const errors = {};
  
  if (searchTerm && searchTerm.length < 2) {
    errors.searchTerm = 'Search term must be at least 2 characters';
  }
  
  if (searchTerm && searchTerm.length > 50) {
    errors.searchTerm = 'Search term is too long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Object} - Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  const errors = {};
  
  if (!startDate) {
    errors.startDate = 'Start date is required';
  }
  
  if (!endDate) {
    errors.endDate = 'End date is required';
  }
  
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.dateRange = 'Start date must be before end date';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get color based on appointment status
 * @param {string} status - Appointment status
 * @returns {string} - Hex color code
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'Booked':
      return '#10b981'; // green
    case 'Cancelled':
      return '#ef4444'; // red
    case 'Completed':
      return '#6b7280'; // gray
    default:
      return '#3b82f6'; // blue
  }
};

/**
 * Get readable status text
 * @param {string} status - Appointment status
 * @returns {string} - Formatted status text
 */
export const getStatusText = (status) => {
  return status || 'Unknown';
};

/**
 * Get status badge class
 * @param {string} status - Appointment status
 * @returns {string} - CSS class name
 */
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Booked':
      return 'rasa-status-booked';
    case 'Cancelled':
      return 'rasa-status-cancelled';
    case 'Completed':
      return 'rasa-status-completed';
    default:
      return 'rasa-status-default';
  }
};

/**
 * Check if appointment can be cancelled
 * @param {Object} appointment - Appointment object
 * @returns {boolean} - True if appointment can be cancelled
 */
export const canCancelAppointment = (appointment) => {
  if (!appointment) return false;
  
  // Can only cancel if status is Booked and date is in the future
  return (
    appointment.status === 'Booked' && 
    !isDateInPast(appointment.date)
  );
};

/**
 * Check if appointment is upcoming
 * @param {Object} appointment - Appointment object
 * @returns {boolean} - True if appointment is upcoming
 */
export const isUpcomingAppointment = (appointment) => {
  if (!appointment) return false;
  
  return (
    appointment.status === 'Booked' && 
    !isDateInPast(appointment.date)
  );
};

/**
 * Sanitize search input
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  
  // Remove special characters except spaces and hyphens
  return input.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
};

/**
 * Format error message for display
 * @param {Error|string|Object} error - Error to format
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (error.error) {
    return error.error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if time slot is valid format
 * @param {string} slot - Time slot string
 * @returns {boolean} - True if valid format
 */
export const isValidTimeSlot = (slot) => {
  if (!slot) return false;
  
  // Check format: HH:MM AM/PM (e.g., "10:00 AM")
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  return timeRegex.test(slot);
};

/**
 * Sort appointments by date and time
 * @param {Array} appointments - Array of appointment objects
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted array
 */
export const sortAppointmentsByDate = (appointments, order = 'asc') => {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (order === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
};

/**
 * Filter appointments by status
 * @param {Array} appointments - Array of appointment objects
 * @param {string} status - Status to filter by
 * @returns {Array} - Filtered array
 */
export const filterAppointmentsByStatus = (appointments, status) => {
  if (!status || status === 'all') {
    return appointments;
  }
  
  return appointments.filter(apt => apt.status === status);
};

/**
 * Get appointment count by status
 * @param {Array} appointments - Array of appointment objects
 * @returns {Object} - Object with counts for each status
 */
export const getAppointmentCounts = (appointments) => {
  return {
    total: appointments.length,
    booked: appointments.filter(a => a.status === 'Booked').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    upcoming: appointments.filter(a => isUpcomingAppointment(a)).length
  };
};

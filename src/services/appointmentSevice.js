import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const appointmentService = {
  /**
   * Get available slots for a specific doctor on a specific date
   * @param {string} doctorId - Doctor's MongoDB ObjectId
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object>} - Object containing available slots array
   */
  getAvailableSlots: async (doctorId, date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/slots`, {
        params: { 
          doctorId, 
          date 
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch available slots' };
    }
  },

  /**
   * Book a new appointment
   * @param {Object} appointmentData - Appointment details
   * @param {string} appointmentData.patientId - Patient's MongoDB ObjectId
   * @param {string} appointmentData.doctorId - Doctor's MongoDB ObjectId
   * @param {string} appointmentData.date - Date in YYYY-MM-DD format
   * @param {string} appointmentData.slot - Time slot (e.g., "10:00 AM")
   * @returns {Promise<Object>} - Created appointment object
   */
  bookAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments/book`, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to book appointment' };
    }
  },

  /**
   * Get all appointments for a specific patient
   * @param {string} patientId - Patient's MongoDB ObjectId
   * @returns {Promise<Array>} - Array of appointment objects
   */
  getPatientAppointments: async (patientId) => {
    try {
    const response = await axios.get(`${API_BASE_URL}/appointments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch appointments' };
    }
  },

  /**
   * Cancel an existing appointment
   * @param {string} appointmentId - Appointment's MongoDB ObjectId
   * @returns {Promise<Object>} - Updated appointment object with Cancelled status
   */
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/appointments/cancel/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel appointment' };
    }
  }
};
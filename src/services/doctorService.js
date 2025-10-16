import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const doctorService = {
  /**
   * Get all doctors from the database
   * @returns {Promise<Array>} - Array of doctor objects
   */
  getAllDoctors: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch doctors' };
    }
  },

  /**
   * Get a single doctor by their ID
   * @param {string} doctorId - Doctor's MongoDB ObjectId
   * @returns {Promise<Object>} - Doctor object with details
   */
  getDoctorById: async (doctorId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch doctor details' };
    }
  },

  /**
   * Search doctors by name or specialty (client-side filtering)
   * @param {string} searchTerm - Search term for name or specialty
   * @returns {Promise<Array>} - Filtered array of doctor objects
   */
  searchDoctors: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      const doctors = response.data;
      
      // If no search term, return all doctors
      if (!searchTerm) return doctors;
      
      // Filter doctors by search term (case-insensitive)
      const term = searchTerm.toLowerCase();
      return doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term)
      );
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search doctors' };
    }
  },

  /**
   * Filter doctors by specialty
   * @param {string} specialty - Specialty to filter by
   * @returns {Promise<Array>} - Filtered array of doctor objects
   */
  filterBySpecialty: async (specialty) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      const doctors = response.data;
      
      // If no specialty or "all", return all doctors
      if (!specialty || specialty === 'all') return doctors;
      
      // Filter doctors by specialty (case-insensitive)
      return doctors.filter(doctor => 
        doctor.specialty.toLowerCase() === specialty.toLowerCase()
      );
    } catch (error) {
      throw error.response?.data || { message: 'Failed to filter doctors' };
    }
  },

  /**
   * Get unique list of all specialties from doctors
   * @returns {Promise<Array>} - Array of unique specialty strings
   */
  getAllSpecialties: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      const doctors = response.data;
      
      // Extract unique specialties
      const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
      return specialties.sort();
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch specialties' };
    }
  }
};
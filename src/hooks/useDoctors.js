import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '../services/doctorService';

/**
 * Custom hook for managing doctor search and filter state
 * @returns {Object} - Doctor state and operations
 */
export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [availableSpecialties, setAvailableSpecialties] = useState([]);

  /**
   * Fetch all doctors from the API
   */
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
      
      // Extract unique specialties
      const specialties = [...new Set(data.map(d => d.specialty))];
      setAvailableSpecialties(specialties.sort());
    } catch (err) {
      setError(err.message || 'Failed to fetch doctors');
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  /**
   * Apply search and filters whenever doctors or filters change
   */
  useEffect(() => {
    let result = [...doctors];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term)
      );
    }
    
    // Apply specialty filter
    if (specialtyFilter && specialtyFilter !== 'all') {
      result = result.filter(doctor => 
        doctor.specialty.toLowerCase() === specialtyFilter.toLowerCase()
      );
    }
    
    setFilteredDoctors(result);
  }, [doctors, searchTerm, specialtyFilter]);

  /**
   * Search doctors by term
   * @param {string} term - Search term
   * @param {string} specialty - Optional specialty filter
   */
  const searchDoctors = useCallback((term, specialty = 'all') => {
    setSearchTerm(term || '');
    setSpecialtyFilter(specialty);
  }, []);

  /**
   * Filter doctors by specialty only
   * @param {string} specialty - Specialty to filter by
   */
  const filterBySpecialty = useCallback((specialty) => {
    setSpecialtyFilter(specialty);
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSpecialtyFilter('all');
  }, []);

  /**
   * Get doctor by ID
   * @param {string} doctorId - Doctor's MongoDB ObjectId
   * @returns {Promise<Object|null>} - Doctor object or null
   */
  const getDoctorById = useCallback(async (doctorId) => {
    try {
      const doctor = await doctorService.getDoctorById(doctorId);
      return doctor;
    } catch (err) {
      console.error('Failed to fetch doctor:', err);
      return null;
    }
  }, []);

  /**
   * Get doctors by specialty
   * @param {string} specialty - Specialty to filter by
   * @returns {Array} - Array of doctors with matching specialty
   */
  const getDoctorsBySpecialty = useCallback((specialty) => {
    if (!specialty || specialty === 'all') return doctors;
    
    return doctors.filter(doctor => 
      doctor.specialty.toLowerCase() === specialty.toLowerCase()
    );
  }, [doctors]);

  /**
   * Get list of all specialties
   * @returns {Array} - Array of unique specialties
   */
  const getSpecialties = useCallback(() => {
    return availableSpecialties;
  }, [availableSpecialties]);

  /**
   * Sort doctors by name
   * @param {string} order - Sort order ('asc' or 'desc')
   * @returns {Array} - Sorted array of doctors
   */
  const sortDoctorsByName = useCallback((order = 'asc') => {
    const sorted = [...filteredDoctors].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (order === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    
    setFilteredDoctors(sorted);
    return sorted;
  }, [filteredDoctors]);

  /**
   * Get doctors with available slots
   * @returns {Array} - Array of doctors who have available slots
   */
  const getDoctorsWithAvailableSlots = useCallback(() => {
    return filteredDoctors.filter(doctor => 
      doctor.availableSlots && doctor.availableSlots.length > 0
    );
  }, [filteredDoctors]);

  /**
   * Get statistics about doctors
   * @returns {Object} - Statistics object
   */
  const getStatistics = useCallback(() => {
    const specialtyCounts = {};
    
    doctors.forEach(doctor => {
      if (specialtyCounts[doctor.specialty]) {
        specialtyCounts[doctor.specialty]++;
      } else {
        specialtyCounts[doctor.specialty] = 1;
      }
    });
    
    return {
      total: doctors.length,
      filtered: filteredDoctors.length,
      specialties: availableSpecialties.length,
      specialtyCounts,
      withAvailableSlots: doctors.filter(d => 
        d.availableSlots && d.availableSlots.length > 0
      ).length
    };
  }, [doctors, filteredDoctors, availableSpecialties]);

  return {
    // Data
    doctors: filteredDoctors,
    allDoctors: doctors,
    loading,
    error,
    
    // Filters
    searchTerm,
    specialtyFilter,
    availableSpecialties,
    
    // Operations
    searchDoctors,
    filterBySpecialty,
    clearFilters,
    refetch: fetchDoctors,
    
    // Queries
    getDoctorById,
    getDoctorsBySpecialty,
    getSpecialties,
    sortDoctorsByName,
    getDoctorsWithAvailableSlots,
    getStatistics
  };
};

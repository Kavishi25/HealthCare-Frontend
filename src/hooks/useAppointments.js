import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentSevice';
import { sortAppointmentsByDate, filterAppointmentsByStatus } from '../utils/validators';

/**
 * Custom hook for managing appointment state and operations
 * @param {string} patientId - Patient's MongoDB ObjectId
 * @returns {Object} - Appointment state and operations
 */
export const useAppointments = (patientId) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Booked', 'Completed', 'Cancelled'

  /**
   * Fetch all appointments for the patient
   */
  const fetchAppointments = useCallback(async () => {
    if (!patientId) {
      setError('Patient ID is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await appointmentService.getPatientAppointments(patientId);
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /**
   * Apply filters and sorting whenever appointments or filters change
   */
  useEffect(() => {
    let result = [...appointments];
    
    // Apply status filter
    result = filterAppointmentsByStatus(result, statusFilter);
    
    // Apply sorting
    result = sortAppointmentsByDate(result, sortOrder);
    
    setFilteredAppointments(result);
  }, [appointments, statusFilter, sortOrder]);

  /**
   * Cancel an appointment
   * @param {string} appointmentId - Appointment's MongoDB ObjectId
   * @returns {Promise<Object>} - Result with success status
   */
  const cancelAppointment = async (appointmentId) => {
    try {
      await appointmentService.cancelAppointment(appointmentId);
      await fetchAppointments(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || 'Failed to cancel appointment' 
      };
    }
  };

  /**
   * Book a new appointment
   * @param {Object} appointmentData - Appointment details
   * @returns {Promise<Object>} - Result with success status and data
   */
  const bookAppointment = async (appointmentData) => {
    try {
      const result = await appointmentService.bookAppointment(appointmentData);
      await fetchAppointments(); // Refresh the list
      return { success: true, data: result };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || 'Failed to book appointment' 
      };
    }
  };

  /**
   * Filter appointments by status
   * @param {string} status - Status to filter by ('all', 'Booked', 'Completed', 'Cancelled')
   */
  const filterByStatus = (status) => {
    setStatusFilter(status);
  };

  /**
   * Sort appointments by date
   * @param {string} order - Sort order ('asc' or 'desc')
   */
  const sortByDate = (order) => {
    setSortOrder(order);
  };

  /**
   * Get upcoming appointments (Booked status and future dates)
   */
  const getUpcomingAppointments = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(apt => 
      apt.status === 'Booked' && 
      new Date(apt.date) >= today
    );
  }, [appointments]);

  /**
   * Get past appointments
   */
  const getPastAppointments = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(apt => 
      new Date(apt.date) < today
    );
  }, [appointments]);

  /**
   * Get appointment by ID
   * @param {string} appointmentId - Appointment's MongoDB ObjectId
   * @returns {Object|null} - Appointment object or null
   */
  const getAppointmentById = useCallback((appointmentId) => {
    return appointments.find(apt => apt._id === appointmentId) || null;
  }, [appointments]);

  /**
   * Get statistics about appointments
   * @returns {Object} - Statistics object
   */
  const getStatistics = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: appointments.length,
      booked: appointments.filter(a => a.status === 'Booked').length,
      completed: appointments.filter(a => a.status === 'Completed').length,
      cancelled: appointments.filter(a => a.status === 'Cancelled').length,
      upcoming: appointments.filter(a => 
        a.status === 'Booked' && new Date(a.date) >= today
      ).length,
      past: appointments.filter(a => new Date(a.date) < today).length
    };
  }, [appointments]);

  return {
    // Data
    appointments: filteredAppointments,
    allAppointments: appointments,
    loading,
    error,
    
    // Filters and sorting
    statusFilter,
    sortOrder,
    filterByStatus,
    sortByDate,
    
    // Operations
    refetch: fetchAppointments,
    cancelAppointment,
    bookAppointment,
    
    // Computed data
    getUpcomingAppointments,
    getPastAppointments,
    getAppointmentById,
    getStatistics
  };
};
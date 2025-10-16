// src/utils/dateUtils.js

/**
 * Format date as YYYY-MM-DD (for input fields)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getToday = () => {
  return formatDateForInput(new Date());
};

/**
 * Get date 30 days ago
 */
export const getThirtyDaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return formatDateForInput(d);
};

/**
 * Format date for display (e.g., "Oct 16, 2025")
 */
export const formatDateForDisplay = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
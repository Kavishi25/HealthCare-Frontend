/**
 * Format a date object or string to a readable format
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string (e.g., "December 25, 2024")
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string (e.g., "2024-12-25")
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format time string (already in correct format)
 * @param {string} timeString - Time string (e.g., "10:00 AM")
 * @returns {string} - Formatted time string
 */
export const formatTime = (timeString) => {
  return timeString; // Already in format like "10:00 AM"
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} - Today's date
 */
export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get minimum date for date picker (today)
 * @returns {string} - Minimum date in YYYY-MM-DD format
 */
export const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Get maximum date for date picker (90 days from today)
 * @returns {string} - Maximum date in YYYY-MM-DD format
 */
export const getMaxDate = () => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90); // 3 months ahead
  return maxDate.toISOString().split('T')[0];
};

/**
 * Check if a date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

/**
 * Check if a date is tomorrow
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is tomorrow
 */
export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkDate = new Date(date);
  return tomorrow.toDateString() === checkDate.toDateString();
};

/**
 * Get relative date string (Today, Tomorrow, Yesterday, etc.)
 * @param {Date|string} date - Date to format
 * @returns {string} - Relative date string
 */
export const getRelativeDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const diffTime = checkDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  
  return formatDate(date);
};

/**
 * Get day of week from date
 * @param {Date|string} date - Date to check
 * @returns {string} - Day of week (e.g., "Monday")
 */
export const getDayOfWeek = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Get short day of week from date
 * @param {Date|string} date - Date to check
 * @returns {string} - Short day of week (e.g., "Mon")
 */
export const getShortDayOfWeek = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Add days to a date
 * @param {Date|string} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} - New date object
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get time difference between two dates in days
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} - Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = d2 - d1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format date with time
 * @param {Date|string} date - Date to format
 * @param {string} time - Time string (e.g., "10:00 AM")
 * @returns {string} - Formatted date and time
 */
export const formatDateWithTime = (date, time) => {
  return `${formatDate(date)} at ${time}`;
};
import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Displays a spinning loader with optional message
 * Used throughout the application for loading states
 * 
 * @param {string} message - Loading message to display (default: "Loading...")
 * @param {string} size - Size of spinner: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} variant - Color variant: 'primary', 'secondary', 'white' (default: 'primary')
 */
const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'medium',
  variant = 'primary' 
}) => {
  return (
    <div className="rasa-loading-container">
      <div 
        className={`rasa-spinner rasa-spinner-${size} rasa-spinner-${variant}`}
        role="status"
        aria-label="Loading"
      >
        <div className="rasa-spinner-circle"></div>
      </div>
      {message && (
        <p className="rasa-loading-text">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
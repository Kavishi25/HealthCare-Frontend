import React from 'react';
import './ErrorMessage.css';

/**
 * ErrorMessage Component
 * Displays error messages with optional retry functionality
 * Used throughout the application for error states
 * 
 * @param {string} message - Error message to display
 * @param {Function} onRetry - Optional callback function for retry button
 * @param {string} title - Optional custom title (default: "Error")
 * @param {string} type - Error type: 'error', 'warning', 'info' (default: 'error')
 */
const ErrorMessage = ({ 
  message, 
  onRetry, 
  title = 'Error',
  type = 'error'
}) => {
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'error':
      default:
        return '❌';
    }
  };

  return (
    <div className={`rasa-error-container rasa-error-${type}`} role="alert">
      <div className="rasa-error-content">
        <div className="rasa-error-icon" aria-hidden="true">
          {getIcon()}
        </div>
        
        <div className="rasa-error-details">
          <h3 className="rasa-error-title">{title}</h3>
          <p className="rasa-error-text">{message}</p>
        </div>
      </div>
      
      {onRetry && (
        <div className="rasa-error-actions">
          <button 
            className="rasa-error-retry-btn" 
            onClick={onRetry}
            aria-label="Retry"
          >
            <span className="rasa-retry-icon">🔄</span>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
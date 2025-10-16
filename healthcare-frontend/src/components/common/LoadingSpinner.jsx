// src/components/common/LoadingSpinner.jsx
import React from 'react';

const spinnerStyle = {
  display: 'inline-block',
  width: '48px',
  height: '48px',
  border: '4px solid rgba(0, 0, 0, 0.1)',
  borderTopColor: '#4f46e5',
  borderRadius: '50%',
  animation: 'spin 1s ease-in-out infinite',
};

const wrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '160px',
};

const LoadingSpinner = () => {
  return (
    <div style={wrapperStyle}>
      <div style={spinnerStyle} />
      <style>
        {`@keyframes spin { to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
};

export default LoadingSpinner;



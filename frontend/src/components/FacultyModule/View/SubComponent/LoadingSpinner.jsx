import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`loading-container ${fullPage ? 'full-page' : ''}`}>
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
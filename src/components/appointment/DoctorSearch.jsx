import React, { useState, useEffect } from 'react';
import '../../styles/DoctorSearch.css';

/**
 * DoctorSearch Component
 * Provides search input and specialty filter for finding doctors
 * 
 * @param {Function} onSearch - Callback function when search/filter changes
 * @param {Array} specialties - List of available specialties for filtering
 */
const DoctorSearch = ({ onSearch, specialties = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Debounced search - wait 300ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm, selectedSpecialty);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSpecialty, onSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedSpecialty('all');
  };

  const hasActiveFilters = searchTerm || selectedSpecialty !== 'all';

  return (
    <div className="rasa-doctor-search">
      
      
      <div className="rasa-search-controls">
        {/* Search Input with Icon */}
        <div className="rasa-search-input-wrapper">
          <input
            type="text"
            className="rasa-search-input"
            placeholder="Search by doctor name or specialty..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search doctors"
          />
        
        </div>
<br/>
        {/* Specialty Filter Dropdown */}
        <div className="rasa-filter-wrapper">
          <select
            className="rasa-specialty-filter"
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            aria-label="Filter by specialty"
          >
            <option value="all">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button - Only shown when filters are active */}
        {hasActiveFilters && (
          <button 
            className="rasa-clear-btn" 
            onClick={handleClear}
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filter Indicator */}
      {hasActiveFilters && (
        <div className="rasa-active-filters">
          <span className="rasa-filter-label">Active Filters:</span>
          {searchTerm && (
            <span className="rasa-filter-tag">
              Search: "{searchTerm}"
              <button 
                className="rasa-filter-tag-remove"
                onClick={() => setSearchTerm('')}
                aria-label="Remove search filter"
              >
                ×
              </button>
            </span>
          )}
          {selectedSpecialty !== 'all' && (
            <span className="rasa-filter-tag">
              Specialty: {selectedSpecialty}
              <button 
                className="rasa-filter-tag-remove"
                onClick={() => setSelectedSpecialty('all')}
                aria-label="Remove specialty filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;
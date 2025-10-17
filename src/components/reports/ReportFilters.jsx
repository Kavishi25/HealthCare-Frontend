// src/components/reports/ReportFilters.jsx
import React from 'react';

const ReportFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <select
          name="department"
          value={filters.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none"
        >
          <option value="all">All Departments</option>
          <option value="cardiology">Cardiology</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="emergency">Emergency</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="neurology">Neurology</option>
        </select>
      </div>
      <div className="flex items-end">
        <p className="text-xs text-gray-500">
          Filter reports by date range and department
        </p>
      </div>
    </div>
  );
};

export default ReportFilters;
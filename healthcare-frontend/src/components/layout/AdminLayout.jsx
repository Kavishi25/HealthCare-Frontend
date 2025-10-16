// src/components/layout/AdminLayout.jsx
import React from 'react';

const AdminLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Smart Healthcare System</h1>
            <p className="text-sm text-blue-600 font-medium">{title}</p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Urban Hospitals • Sri Lanka
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
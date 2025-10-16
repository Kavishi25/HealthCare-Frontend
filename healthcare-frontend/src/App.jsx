/*// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminReportsPage from './pages/AdminReportsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminReportsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
      </Routes>
    </Router>
  );
};

export default App;*/
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientReportsPage from './pages/PatientReportsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/patients" element={<PatientReportsPage />} />
      </Routes>
    </Router>
  );
};

export default App;

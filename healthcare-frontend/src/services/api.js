/*// src/services/api.js
export const fetchReports = async (filters) => {
  // In real app: call backend like `/api/reports?start=...&end=...`
  // For now, simulate delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    dailyStats: [
      { date: "2025-10-01", department: "cardiology", visits: 45, avgWaitTime: 22 },
      { date: "2025-10-02", department: "pediatrics", visits: 60, avgWaitTime: 18 },
      { date: "2025-10-03", department: "emergency", visits: 85, avgWaitTime: 30 },
    ]
  };
};*/
// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

export const fetchPatients = async () => {
  const response = await fetch(`${API_BASE}/patients`);
  if (!response.ok) throw new Error('Failed to fetch patients');
  return response.json();
};

// Keep your existing fetchReports function
export const fetchReports = async (filters) => {
  // ... your code
};
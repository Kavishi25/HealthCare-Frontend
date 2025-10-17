// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    todayAppointments: 0,
    avgWaitTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 REAL API CALL TO BACKEND
    const loadStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
        // Optional: show user-friendly error message
        setStats({
          totalPatients: 0,
          activePatients: 0,
          todayAppointments: 0,
          avgWaitTime: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []); // Empty dependency array = runs once on mount

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients.toLocaleString(),
      change: '+12% from last month',
      color: 'bg-blue-500'
    },
    {
      title: 'Active Patients',
      value: stats.activePatients.toLocaleString(),
      change: '+8% from last month',
      color: 'bg-green-500'
    },
    {
      title: 'Today’s Appointments',
      value: stats.todayAppointments,
      change: '15 completed',
      color: 'bg-purple-500'
    },
    {
      title: 'Avg. Wait Time',
      value: `${stats.avgWaitTime} min`,
      change: '↓ 3 min from yesterday',
      color: 'bg-amber-500'
    }
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome back! Here’s what’s happening today.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${card.color} bg-opacity-10 flex items-center justify-center`}>
                  <div className={`w-6 h-6 rounded ${card.color}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/admin/patients"
              className="block p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <div className="text-blue-600 font-medium">View Patient Reports</div>
              <p className="text-sm text-gray-600 mt-1">Manage patient records</p>
            </a>
            <a
              href="/admin/reports"
              className="block p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <div className="text-green-600 font-medium">System Reports</div>
              <p className="text-sm text-gray-600 mt-1">Analyze hospital performance</p>
            </a>
            <a
              href="/admin/appointments"
              className="block p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <div className="text-purple-600 font-medium">Appointments</div>
              <p className="text-sm text-gray-600 mt-1">Schedule & manage visits</p>
            </a>
          </div>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm text-gray-800">Patient <span className="font-medium">P100{i}23</span> checked in</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
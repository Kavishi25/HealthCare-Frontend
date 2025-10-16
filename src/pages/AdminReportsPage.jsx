import React, { useState, useEffect } from 'react';
import { Download, Calendar, Filter, TrendingUp, Users, Clock, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data generator
const generateMockData = (filters) => {
  const departments = ['cardiology', 'neurology', 'pediatrics', 'emergency', 'orthopedics'];
  const startDate = new Date(filters.startDate);
  const endDate = new Date(filters.endDate);
  const dailyStats = [];
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dept = filters.department === 'all' 
      ? departments[Math.floor(Math.random() * departments.length)]
      : filters.department;
    
    dailyStats.push({
      date: dateStr,
      department: dept,
      visits: Math.floor(Math.random() * 100) + 50,
      avgWaitTime: Math.floor(Math.random() * 30) + 10,
    });
  }
  
  return { dailyStats };
};

// Utility functions
const getThirtyDaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
};

const getToday = () => new Date().toISOString().split('T')[0];

// AdminLayout Component
const AdminLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-purple-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                Smart Healthcare System
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-medium">Urban Hospitals • Sri Lanka</p>
            </div>
            {title && (
              <div className="bg-gradient-to-r from-purple-100 to-green-100 px-6 py-3 rounded-xl border-2 border-purple-200">
                <h2 className="text-xl font-bold text-purple-800">{title}</h2>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-purple-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6 text-sm text-gray-600 font-medium text-center">
          © {new Date().getFullYear()} Smart Healthcare System — Built for Urban Hospitals
        </div>
      </footer>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${color.replace('border', 'bg').replace('200', '100')}`}>
        <Icon className={`w-8 h-8 ${color.replace('border-', 'text-').replace('200', '600')}`} />
      </div>
    </div>
  </div>
);

// Report Filters Component
const ReportFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field, value) => {
    const updated = { ...localFilters, [field]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-800">Filter Reports</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
          <select
            value={localFilters.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium transition-all bg-white"
          >
            <option value="all">All Departments</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="emergency">Emergency</option>
            <option value="orthopedics">Orthopedics</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Export Button Component
const ExportButton = ({ data, filename = 'report' }) => {
  const exportToCSV = () => {
    const headers = ['Date', 'Department', 'Patient Visits', 'Avg. Wait Time (min)'];
    const rows = data.dailyStats.map(row =>
      [row.date, row.department, row.visits, row.avgWaitTime].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-sm"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
};

// Report Chart Component
const ReportChart = ({ data }) => {
  if (!data || !data.dailyStats || data.dailyStats.length === 0) {
    return null;
  }
  const visitsColor = '#7c3aed'; // purple-600
  const waitColor = '#059669'; // emerald-600
  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={data.dailyStats}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fontFamily: 'Poppins', fill: '#6b7280' }}
          stroke="#9ca3af"
        />
        <YAxis
          tick={{ fontSize: 12, fontFamily: 'Poppins', fill: '#6b7280' }}
          stroke="#9ca3af"
        />
        <Tooltip
          cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }}
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontFamily: 'Poppins',
            fontWeight: 500,
            color: '#111827',
          }}
          labelStyle={{ color: '#6b7280' }}
        />
        <Legend wrapperStyle={{ fontFamily: 'Poppins', fontWeight: 600, color: '#374151' }} />
        <Bar dataKey="visits" name="Patient Visits" fill={visitsColor} radius={[8, 8, 0, 0]} />
        <Bar dataKey="avgWaitTime" name="Avg Wait Time (min)" fill={waitColor} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Report Table Component
const ReportTable = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-purple-100">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-purple-100 to-green-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">Department</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">Patient Visits</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">Avg. Wait Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-100 bg-white">
          {data.dailyStats.map((row, index) => (
            <tr key={index} className="hover:bg-purple-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{row.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 capitalize">{row.department}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">{row.visits}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{row.avgWaitTime} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 font-semibold">Loading reports...</p>
  </div>
);

// Main Page Component
const AdminReportsPage = () => {
  const [filters, setFilters] = useState({
    startDate: getThirtyDaysAgo(),
    endDate: getToday(),
    department: 'all',
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (!filters.startDate || !filters.endDate) return;

    const loadReports = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = generateMockData(filters);
        setReportData(data);
      } catch (error) {
        console.error('Failed to load reports', error);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [filters]);

  // Calculate summary stats
  const totalVisits = reportData?.dailyStats.reduce((sum, row) => sum + row.visits, 0) || 0;
  const avgWaitTime = reportData?.dailyStats.length 
    ? Math.round(reportData.dailyStats.reduce((sum, row) => sum + row.avgWaitTime, 0) / reportData.dailyStats.length)
    : 0;

  return (
    <AdminLayout title="System Reports">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard icon={Users} label="Total Patients" value={totalVisits} color="border-purple-200" />
          <StatsCard icon={Clock} label="Avg Wait Time" value={`${avgWaitTime} min`} color="border-green-200" />
          <StatsCard icon={Activity} label="Report Period" value={`${reportData?.dailyStats.length || 0} days`} color="border-purple-200" />
        </div>

        {/* Filters */}
        <ReportFilters filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <LoadingSpinner />
        ) : reportData ? (
          <>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Report Summary
                </h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {filters.startDate} to {filters.endDate}
                </p>
              </div>
              <ExportButton data={reportData} filename="hospital_system_report" />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h4 className="text-xl font-bold text-gray-800">Daily Patient Analytics</h4>
              </div>
              <ReportChart data={reportData} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <h4 className="text-xl font-bold text-gray-800">Detailed Statistics</h4>
                </div>
              </div>
              <ReportTable data={reportData} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-700">No Data Available</p>
            <p className="text-gray-500 mt-2 font-medium">Try adjusting your date range or department filter.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
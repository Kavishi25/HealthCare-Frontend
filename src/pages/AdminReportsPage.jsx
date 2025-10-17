import React, { useState, useEffect } from 'react';
import { Download, Calendar, Filter, TrendingUp, Users, Clock, Activity, ChevronDown, Info, BarChart3, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

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
      date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: dateStr,
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

// Enhanced Stats Card with animations
const StatsCard = ({ icon: Icon, label, value, subtitle, gradient, iconBg }) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20`}>
    <div className="relative z-10 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl ${iconBg} backdrop-blur-sm shadow-lg`}>
          <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <p className="text-white/95 text-base sm:text-lg font-extrabold mb-2 uppercase tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">{label}</p>
        <p className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-2 tracking-tight leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]">{value}</p>
        {subtitle && <p className="text-white/90 text-sm sm:text-base font-bold leading-snug drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{subtitle}</p>}
      </div>
    </div>
    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
  </div>
);

// Simplified Filter Section
const QuickFilters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickPresets = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
  ];

  const applyPreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onFilterChange({
      ...filters,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Quick Presets */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Quick Filters</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
          >
            {isExpanded ? 'Simple' : 'Advanced'}
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {quickPresets.map((preset) => (
            <button
              key={preset.days}
              onClick={() => applyPreset(preset.days)}
              className="px-5 py-2.5 bg-white hover:bg-purple-600 hover:text-white text-gray-700 font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium transition-all bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium transition-all bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600" />
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all bg-white appearance-none cursor-pointer"
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
      )}
    </div>
  );
};

// Enhanced Chart with tooltips
const EnhancedChart = ({ data, type = 'area' }) => {
  if (!data || !data.dailyStats || data.dailyStats.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-purple-100">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data.dailyStats}>
        <defs>
          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date"
          tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }}
          stroke="#d1d5db"
        />
        <YAxis
          tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }}
          stroke="#d1d5db"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontWeight: 700, paddingTop: 20 }} />
        <Area 
          type="monotone" 
          dataKey="visits" 
          stroke="#8b5cf6" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorVisits)" 
          name="Patient Visits"
        />
        <Area 
          type="monotone" 
          dataKey="avgWaitTime" 
          stroke="#10b981" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorWait)" 
          name="Wait Time (min)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Simplified Table
const SimpleTable = ({ data }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const sortedData = [...data.dailyStats].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortDirection === 'asc' ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-gray-100 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-500 to-blue-500">
            <tr>
              <th 
                onClick={() => handleSort('fullDate')}
                className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide cursor-pointer hover:bg-purple-600 transition-colors"
              >
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">
                Department
              </th>
              <th 
                onClick={() => handleSort('visits')}
                className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide cursor-pointer hover:bg-purple-600 transition-colors"
              >
                Visits
              </th>
              <th 
                onClick={() => handleSort('avgWaitTime')}
                className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide cursor-pointer hover:bg-purple-600 transition-colors"
              >
                Wait Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-purple-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                  {row.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold text-xs capitalize">
                    {row.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-purple-600">{row.visits}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-green-600">{row.avgWaitTime} min</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Export Button
const ExportButton = ({ data, filename = 'report' }) => {
  const exportToCSV = () => {
    const headers = ['Date', 'Department', 'Patient Visits', 'Avg. Wait Time (min)'];
    const rows = data.dailyStats.map(row =>
      [row.fullDate, row.department, row.visits, row.avgWaitTime].join(',')
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
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold hover:scale-105"
    >
      <Download className="w-5 h-5" />
      Export Report
    </button>
  );
};

// Loading State
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-purple-200 rounded-full"></div>
      <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
    </div>
    <p className="mt-6 text-gray-600 font-bold text-lg">Loading your reports...</p>
  </div>
);

// Main Component
const AdminReportsPage = () => {
  const [filters, setFilters] = useState({
    startDate: getThirtyDaysAgo(),
    endDate: getToday(),
    department: 'all',
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!filters.startDate || !filters.endDate) return;

    const loadReports = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
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

  const totalVisits = reportData?.dailyStats.reduce((sum, row) => sum + row.visits, 0) || 0;
  const avgWaitTime = reportData?.dailyStats.length 
    ? Math.round(reportData.dailyStats.reduce((sum, row) => sum + row.avgWaitTime, 0) / reportData.dailyStats.length)
    : 0;
  const peakDay = reportData?.dailyStats.reduce((max, row) => row.visits > max.visits ? row : max, reportData.dailyStats[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Modern Header */}
      <header className="bg-white shadow-sm border-b-2 border-purple-100 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-semibold">Track and analyze hospital performance</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-purple-700">Live Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Stats Overview */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              icon={Users} 
              label="Total Patient Visits" 
               value={totalVisits.toLocaleString()} 
               subtitle="Across all departments"
              gradient="from-purple-500 to-purple-600"
              iconBg="bg-white/20"
            />
            <StatsCard 
              icon={Clock} 
              label="Average Wait Time" 
               value={`${avgWaitTime} min`} 
               subtitle="System-wide average"
              gradient="from-blue-500 to-blue-600"
              iconBg="bg-white/20"
            />
            <StatsCard 
              icon={TrendingUp} 
              label="Peak Day" 
              value={peakDay?.visits || 0} 
              subtitle={peakDay?.date || 'N/A'}
              gradient="from-green-500 to-emerald-600"
              iconBg="bg-white/20"
            />
          </div>

          {/* Filters */}
          <QuickFilters filters={filters} onFilterChange={setFilters} />

          {loading ? (
            <LoadingSpinner />
          ) : reportData ? (
            <>
              {/* Chart Section */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                     <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Trends Overview</h3>
                     <p className="text-sm sm:text-base text-gray-600 font-semibold">Daily patient activity and wait times</p>
                    </div>
                  </div>
                  <ExportButton data={reportData} filename="hospital_analytics_report" />
                </div>
                <EnhancedChart data={reportData} />
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                 <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                     <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Detailed Records</h3>
                     <p className="text-sm sm:text-base text-gray-600 font-semibold">Click column headers to sort</p>
                  </div>
                </div>
                <SimpleTable data={reportData} />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h3>
              <p className="text-gray-500 font-medium">Adjust your filters to view reports</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t-2 border-gray-100 bg-white/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-gray-600 font-semibold">
            © {new Date().getFullYear()} Smart Healthcare System · Built with care for better outcomes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminReportsPage;
// src/components/reports/ReportChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportChart = ({ data }) => {
  const chartData = {
    labels: data.dailyStats.map(r => r.date),
    datasets: [
      {
        label: 'Patient Visits',
        data: data.dailyStats.map(r => r.visits),
        backgroundColor: 'rgb(59, 130, 246)', // Tailwind blue-500
        borderColor: 'rgb(37, 99, 235)',      // blue-600
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div>
      <h4 className="text-lg font-medium text-gray-800 mb-4">Daily Patient Visits</h4>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ReportChart;
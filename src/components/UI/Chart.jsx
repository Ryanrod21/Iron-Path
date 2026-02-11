import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function Chart({ history }) {
  if (!history || history.length === 0) {
    return <p>No workout data yet</p>;
  }
  const sortedHistory = [...history].sort((a, b) => a.week - b.week);

  const labels = sortedHistory.map((item) => `Week ${item.week}`);

  const workoutCounts = sortedHistory.map(
    (item) => item.selected_plan.workouts,
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Weekley Result',
        data: [1, 6, 3, 43],
        borderWidth: 2,
        borderColor: 'rgb(41, 208, 238)',
        tension: 0.3,
        pointBackgroundColor: 'black',
        pointBorderColor: 'rgb(41, 208, 238)',
      },
      {
        label: 'Target Weight',
        data: [3, 3, 3, 3],
        type: 'line',
        borderDash: [5, 5],
        borderColor: 'red',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        grid: {
          color: 'white',
          borderColor: 'white',
          borderWidth: 2,
          drawTicks: true,
        },
      },
    },
    x: {
      grid: {
        color: 'red',
        drawTicks: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Workout Progress',
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />;
    </div>
  );
}

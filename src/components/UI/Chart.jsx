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
import Button from '../button';
import { useState } from 'react';
import { BicepsFlexed, ChartColumnIncreasing } from 'lucide-react';

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
  const [goalWeight, setGoalWeight] = useState(0);
  const [weightEnter, setWeightEnter] = useState(0);
  const [weightHistory, setWeightHistory] = useState([]); // initially empty
  const [isEdit, setIsEdit] = useState('');
  const [activeTab, setActiveTab] = useState('progress'); // default chart

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
        data: weightHistory.length > 0 ? weightHistory : [],
        borderWidth: 2,
        borderColor: 'rgb(41, 208, 238)',
        tension: 0.3,
        pointBackgroundColor: 'black',
        pointBorderColor: 'rgb(41, 208, 238)',
      },
      {
        label: 'Target Weight',
        data: [goalWeight, goalWeight, goalWeight],
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
        min: 0,
        suggestedMax: 200,
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

  const handleSave = () => {
    setWeightHistory((prev) => [...prev, Number(weightEnter)]); // append
    setWeightEnter(0); // reset input after save
    setIsEdit(false); // hide input
  };

  return (
    <div className="chart-container">
      <div
        className="tabs"
        style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
      >
        <button
          style={{
            padding: '10px',
            backgroundColor: activeTab === 'progress' ? '#29d0ee' : '#eee',
            color: activeTab === 'progress' ? '#fff' : '#000',
          }}
          onClick={() => setActiveTab('progress')}
        >
          Weekly Progress <BicepsFlexed />
        </button>

        <button
          style={{
            padding: '10px',
            backgroundColor: activeTab === 'workouts' ? '#29d0ee' : '#eee',
            color: activeTab === 'workouts' ? '#fff' : '#000',
          }}
          onClick={() => setActiveTab('workouts')}
        >
          Workout Counts <ChartColumnIncreasing />
        </button>
      </div>

      {activeTab === 'progress' && <Line data={data} options={options} />}
      {activeTab === 'workouts' && (
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Workouts Completed',
                data: workoutCounts,
                borderWidth: 2,
                borderColor: 'green',
                tension: 0.3,
                pointBackgroundColor: 'black',
                pointBorderColor: 'green',
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Weekly Workouts' },
            },
          }}
        />
      )}

      <div className="goals-footer">
        {activeTab === 'progress' && (
          <>
            {!isEdit ? (
              <>
                <p>Target Weight: {goalWeight}</p>
                <Button
                  onClick={() => setIsEdit('goal')}
                  label="Set Goal Weight"
                />
                <p>Enter Weekly Weight: {weightEnter}</p>
                <Button
                  onClick={() => setIsEdit('weekly')}
                  label="Add Weekly Weight"
                />
              </>
            ) : isEdit === 'goal' ? (
              <>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(Number(e.target.value))}
                />
                <Button onClick={() => setIsEdit('')} label="Save" />
              </>
            ) : (
              <>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={weightEnter}
                  onChange={(e) => setWeightEnter(e.target.value)}
                />
                <Button onClick={handleSave} label="Save" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

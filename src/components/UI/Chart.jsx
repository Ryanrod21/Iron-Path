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
import { useState, useEffect } from 'react';
import { BicepsFlexed, ChartColumnIncreasing, Footprints } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { handleGymSave, fetchGymData } from '../../utils/userChartData';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
);

export default function Chart({ history, user }) {
  const [goalWeight, setGoalWeight] = useState('');
  const [weightEnter, setWeightEnter] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);
  const [isEdit, setIsEdit] = useState('');
  const [activeTab, setActiveTab] = useState('progress');
  const [mileHistory, setMileHistory] = useState([]);
  const [mileEnter, setMileEnter] = useState('');
  const [goalMile, setGoalMile] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      const data = await fetchGymData({ supabase, userId: user.id });
      if (!data) return;

      setWeightHistory(data.weight_progress || []);
      setMileHistory(data.miles_progress || []);
      setGoalWeight(data.weight_goal ?? null);
      setGoalMile(data.miles_goal ?? null);
    };

    loadData();
  }, [user?.id]);

  useEffect(() => {
    setIsEdit('');
  }, [activeTab]);

  if (!history || history.length === 0) {
    return <p>No workout data yet</p>;
  }

  const labels = weightHistory.map((entry) =>
    new Date(entry.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  );

  const mileLabels = mileHistory.map((entry) =>
    new Date(entry.date).toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
    }),
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Weight',
        data: weightHistory.map((entry) => entry.weight),
        borderWidth: 2,
        borderColor: 'rgb(41, 208, 238)',
        tension: 0.3,
        pointBackgroundColor: 'black',
        pointBorderColor: 'rgb(41, 208, 238)',
      },
      {
        label: 'Target Weight',
        data: labels.map(() => goalWeight),
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
        title: {
          display: true,
          text: 'Weight (lbs)',
          color: 'white',
          font: {
            size: 14,
            weight: 'bold',
          },
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
        text: 'Date',
        position: 'bottom',
        color: 'white',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
      zoom: {
        pan: {
          enabled: true, // allows panning
          mode: 'x', // horizontal only
          modifierKey: 'ctrl', // optional: require ctrl key
        },
        zoom: {
          wheel: {
            enabled: true, // enable zooming with mouse wheel
          },
          pinch: {
            enabled: true, // enable pinch zoom on touch devices
          },
          mode: 'x', // horizontal zoom only
        },
      },
    },
  };

  const handleSave = (type) => {
    handleGymSave({
      type,
      supabase,
      user,
      weightEnter,
      setWeightEnter,
      setWeightHistory,
      mileEnter,
      setMileEnter,
      setMileHistory,
      goalWeight,
      setGoalWeight,
      goalMile,
      setGoalMile,
      setIsEdit,
    });
  };

  return (
    <div className="chart-container">
      <div className="tabs">
        <button
          className={`tabs-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Weekly Progress <BicepsFlexed />
        </button>

        <button
          className={`tabs-btn ${activeTab === 'run' ? 'active' : ''}`}
          onClick={() => setActiveTab('run')}
        >
          Running Progress <Footprints />
        </button>
      </div>

      {activeTab === 'progress' && (
        <>
          <div style={{ paddingBottom: '20px', margin: '0' }}>
            <h1>Weight Table</h1>
          </div>
          <Line data={data} options={options} />
        </>
      )}

      {activeTab === 'run' && (
        <>
          <div style={{ paddingBottom: '20px', margin: '0' }}>
            <h1>Miles Table</h1>
          </div>
          <Line
            data={{
              labels: mileLabels,
              datasets: [
                {
                  label: 'Miles Completed',
                  data: mileHistory.map((entry) => entry.miles),
                  borderWidth: 2,
                  borderColor: 'rgb(0, 255, 4)',
                  tension: 0.3,
                  pointBackgroundColor: 'black',
                  pointBorderColor: 'rgb(0, 255, 4)',
                },
                {
                  label: 'Target Mile',
                  data: mileLabels.map(() => goalMile),
                  type: 'line',
                  borderDash: [5, 5],
                  borderColor: 'red',
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  min: 0,
                  suggestedMax: 50,
                  grid: {
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 2,
                    drawTicks: true,
                  },
                  title: {
                    display: true,
                    text: 'Miles',
                    color: 'white',
                    font: {
                      size: 14,
                      weight: 'bold',
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                },
                title: {
                  display: true,
                  text: 'Date',
                  position: 'bottom',
                  color: 'white',
                  font: {
                    size: 14,
                    weight: 'bold',
                  },
                },
              },
            }}
          />
        </>
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
                <p>Enter Weekly Weight: </p>
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
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value > 500) return;
                    if (value < 0) return;

                    setGoalWeight(value);
                  }}
                  placeholder="Enter Your Weight Goal"
                />
                <Button
                  onClick={() => handleSave('weight_goal')}
                  label="Save"
                />
                <Button
                  onClick={() => {
                    setIsEdit(false);
                  }}
                  label="Cancel"
                />
              </>
            ) : (
              <>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={weightEnter}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value > 500) return;
                    if (value < 0) return;

                    setWeightEnter(value);
                  }}
                  placeholder="Enter Your Weight"
                />
                <Button
                  onClick={() => handleSave('weight_progress')}
                  label="Save"
                />
                <Button
                  onClick={() => {
                    setIsEdit(false);
                  }}
                  label="Cancel"
                />
              </>
            )}
          </>
        )}

        {activeTab === 'run' && (
          <>
            {!isEdit ? (
              <>
                <p>Target Mile: {goalMile}</p>
                <Button
                  onClick={() => setIsEdit('miles')}
                  label="Set Mile Goal"
                />

                <Button
                  onClick={() => setIsEdit('weekly')}
                  label="Add Your Miles"
                />
              </>
            ) : isEdit === 'miles' ? (
              <>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={goalMile}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value > 500) return;
                    if (value < 0) return;

                    setGoalMile(value);
                  }}
                  placeholder="Enter Your Mile Goal"
                />
                <Button onClick={() => handleSave('miles_goal')} label="Save" />
                <Button
                  onClick={() => {
                    setIsEdit(false);
                  }}
                  label="Cancel"
                />
              </>
            ) : (
              <>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={mileEnter}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value > 500) return;
                    if (value < 0) return;

                    setMileEnter(value);
                  }}
                  placeholder="Enter miles"
                />
                <Button
                  onClick={() => handleSave('miles_progress')}
                  label="Save"
                />
                <Button onClick={() => setIsEdit(false)} label="Cancel" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

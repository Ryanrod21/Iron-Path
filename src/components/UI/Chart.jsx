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
import { BicepsFlexed, ChartColumnIncreasing, Footprints } from 'lucide-react';

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
  const [weightHistory, setWeightHistory] = useState([]); 
  const [isEdit, setIsEdit] = useState('');
  const [activeTab, setActiveTab] = useState('progress'); 
  const [mileHistory, setMileHistory] = useState([])
  const [mileEnter, setMileEnter] = useState(0)
  const [goalMile, setGoalMile] = useState(0)

  if (!history || history.length === 0) {
    return <p>No workout data yet</p>;
  }

  const sortedHistory = [...history].sort((a, b) => a.week - b.week);

  const labelsweek = sortedHistory.map((item) => `Week ${item.week}`);

  const workoutCounts = sortedHistory.map(
    (item) => item.selected_plan.workouts,
  );

  const labels = weightHistory.map((entry) =>
  new Date(entry.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
);

const mileLabels = mileHistory.map((entry) => 
  new Date(entry.date).toLocaleDateString('en-us', {
    month: 'short',
    day: 'numeric'
  })
)


  const data = {
    labels,
    datasets: [
      {
        label: 'Weekley Result',
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
        }
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
    },
  };




  const handleSave = () => {
  if (!weightEnter) return;

  const today = new Date().toISOString().split('T')[0]; 


  setWeightHistory((prev) => [
    ...prev,
    {
      date: today,
      weight: Number(weightEnter),
    },
  ]);

  setWeightEnter('');
  setIsEdit('');
};

const handleMileSave = () => {
  if(!mileEnter) return;

  const today = new Date().toISOString().split('T')[0]; 


  setMileHistory((prev) => [
    ...prev,
    {
      date: today,
      mile: Number(mileEnter)
    }
  ])

  setMileEnter('')
  setIsEdit('')


}

  return (
    <div className="chart-container">
      <div
        className="tabs" >
        <button className= {`tabs-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Weekly Progress <BicepsFlexed />
        </button>

        <button className= {`tabs-btn ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          Workout Counts <ChartColumnIncreasing />
        </button>

        <button className= {`tabs-btn ${activeTab === 'run' ? 'active' : ''}`}
          onClick={() => setActiveTab('run')}
        >
          Running Progress <Footprints />
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

        {activeTab === 'run' && (
        <Line
          data={{
            labels: mileLabels,
            datasets: [
              {
                label: 'Miles Completed',
                data: mileHistory.map((entry) => entry.mile),
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
              }
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
            )}

        <div className="goals-footer">
        {activeTab === 'run' && (
          <>
            {!isEdit ? (
              <>
                <p>Target Mile: {goalMile}</p>
                <Button
                  onClick={() => setIsEdit('goal')}
                  label="Set Mile Goal"
                />
              
                <Button
                  onClick={() => setIsEdit('weekly')}
                  label="Add Your Miles"
                />
              </>
            ) : isEdit === 'goal' ? (
              <>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={goalMile}
                  onChange={(e) => setGoalMile(Number(e.target.value))}
                  
                />
                <Button onClick={() => setIsEdit('')} label="Save" />
              </>
            ) : (
              <>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={mileEnter}
                  onChange={(e) => setMileEnter(e.target.value)}
                  />
                <Button onClick={handleMileSave} label="Save" />
              </>
            )}
          </>
        )}
        </div>
        
    </div>
  );
}

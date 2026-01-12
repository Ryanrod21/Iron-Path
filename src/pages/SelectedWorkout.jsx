'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Zap, Trophy } from 'lucide-react';
import Button from '../components/button';

export default function SelectedWorkout() {
  const [gymRow, setGymRow] = useState(null);
  const [expandedDayIndex, setExpandedDayIndex] = useState(null); // single expand toggle
  const [workouts, setWorkouts] = useState([]); // 🔑 normalized
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('gym')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setGymRow(data);

      // 🔑 NORMALIZE HERE
      const extractedWorkouts = data.plans?.[0]?.plans ?? [];
      setWorkouts(extractedWorkouts);
    };

    fetchWorkout();
  }, []);

  if (!gymRow || workouts.length === 0) {
    return <div style={{ padding: 40 }}>Loading workout...</div>;
  }

  const selectedIndex = gymRow.selected_plan_index;
  const selectedPlan = selectedIndex !== null ? workouts[selectedIndex] : null;

  const otherPlans = workouts.filter((_, index) => index !== selectedIndex);

  const switchPlan = async (newIndex) => {
    setSaving(true);

    const pickedWorkout = workouts[newIndex];

    await supabase
      .from('gym')
      .update({
        selected_plan_index: newIndex,
        selected_plan: pickedWorkout,
      })
      .eq('id', gymRow.id)
      .eq('user_id', gymRow.user_id);

    setGymRow((prev) => ({
      ...prev,
      selected_plan_index: newIndex,
      selected_plan: pickedWorkout,
    }));

    setSaving(false);
  };

  const handleResults = () => {
    navigate('/results');
  };

  const categoryIcons = {
    'Strength Builder': Dumbbell,
    'Endurance Elite': Zap,
    'Athletic Performance': Trophy,
  };

  const Icon = categoryIcons[selectedPlan.category];

  const toggleDay = (index) => {
    setExpandedDayIndex((prev) => (prev === index ? null : index));
  };

  console.log(selectedPlan);

  return (
    <div className="page-container">
      <h1>Your Workout Plan</h1>
      {/* ICON */}
      <div className="icon-center">
        <h3>{selectedPlan.category}</h3>
        <div className="icon-med-div">
          <Icon className="icon-med" />
        </div>
      </div>
      {/* ✅ SELECTED PLAN CARD (same as Results page) */}
      {selectedPlan && (
        <>
          <h2 className="section-title">Selected Workout</h2>
          <hr />

          {/* 🔽 DAILY BREAKDOWN */}
          <h3 className="section-title">Daily Breakdown</h3>

          {selectedPlan.days.map((day, dayIndex) => {
            const isExpanded = expandedDayIndex === dayIndex;

            return (
              <div
                key={dayIndex}
                className={`plan-card day-card picked ${
                  isExpanded ? 'expanded' : ''
                }`}
                onClick={() => toggleDay(dayIndex)}
              >
                <div className="plan-header">
                  <div className="plan-title">
                    <h4 className="day-title">
                      {day.day} — {day.focus}
                    </h4>
                  </div>
                </div>

                {/* 🔽 EXPANDABLE CONTENT */}
                {isExpanded && (
                  <div className="day-exercises">
                    {day.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="exercise-card">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <Icon className="icon-bullet" />
                        </div>
                        <strong className="exercise-name">
                          {exercise.name}
                        </strong>
                        <p className="exercise-reps">
                          Reps/Sets: {exercise.reps_sets}
                        </p>
                        <p className="exercise-notes">
                          Notes: {exercise.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
      {/* 🔁 OTHER PLANS */}
      <h2 className="section-title">Other Saved Plans</h2>
      {otherPlans.map((plan, index) => {
        const realIndex = workouts.indexOf(plan);

        return (
          <div key={index} className="plan-card">
            <div className="plan-title">
              <p className="plan-summary">{plan.plan_summary}</p>
            </div>

            <Button
              className="pick-button"
              disabled={saving}
              onClick={() => switchPlan(realIndex)}
              label={'Switch to this plan'}
            />
          </div>
        );
      })}

      <Button
        className="secondary-button"
        onClick={handleResults}
        label={'Back to results'}
      />
    </div>
  );
}

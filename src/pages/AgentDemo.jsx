import { useState } from 'react';
import { Dumbbell, Zap, Trophy } from 'lucide-react';

export default function AgentDemo() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [pickedIndex, setPickedIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  const userName = 'Visiting User !';

  const state = {
    goal: 'Build Muscle',
    days: 3,
    location: 'Gym',
    plans: [
      {
        plan_summary:
          'Upper / Lower split focused on compound lifts and progressive overload.',
        icon: Dumbbell,
      },
      {
        plan_summary:
          'Push / Pull / Legs routine designed for hypertrophy and strength.',
        icon: Zap,
      },
      {
        plan_summary:
          'Full-body training with higher frequency and balanced recovery.',
        icon: Trophy,
      },
    ],
  };

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePick = (index) => {
    setSaving(true);

    setTimeout(() => {
      setPickedIndex(index);
      setSaving(false);
    }, 600);
  };

  return (
    <div className="page-container">
      <div className="bg-wrapper">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>

      <h1>Your Workout Summary</h1>
      <h2>Welcome, {userName}</h2>

      <section className="section-results">
        <p>
          <strong>Goal:</strong> {state.goal}
        </p>
        <p>
          <strong>Training Days:</strong> {state.days} days per week
        </p>
        <p>
          <strong>Training Location:</strong> {state.location}
        </p>
      </section>

      <hr />

      <h2 className="section-title">AI Suggested Workout Plans</h2>

      {state.plans.map((plan, index) => {
        const Icon = plan.icon;

        return (
          <div
            key={index}
            className={`plan-card
              ${pickedIndex === index ? 'picked' : ''}
              ${expandedIndex === index ? 'expanded' : ''}
            `}
            onClick={() => handleExpand(index)}
          >
            <div className="plan-header">
              <div
                className={`icon-small-div ${
                  pickedIndex === index ? 'picked' : ''
                }`}
              >
                <Icon
                  className={`icon-small ${
                    pickedIndex === index ? 'picked' : ''
                  }`}
                />
              </div>

              <h3>Plan {index + 1}</h3>
            </div>

            <p className="plan-summary">
              <strong>Summary:</strong> {plan.plan_summary}
            </p>

            {expandedIndex === index && (
              <div className="plan-action">
                <button
                  className="pick-button"
                  disabled={saving}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePick(index);
                  }}
                >
                  {saving
                    ? 'Saving...'
                    : pickedIndex === index
                    ? 'Open Workout'
                    : 'I pick this workout'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

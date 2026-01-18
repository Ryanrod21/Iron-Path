import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import BackgroundEffect from '../components/UI/BackgroundEffect';
import ProgressBar from '../components/UI/ProgressBar';
import Button from '../components/button';

export default function Progression() {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to save a workout.');
      setLoading(false);
      return;
    }

    setLoading(true);
  };

  const TOTAL_QUESTIONS = 7; // change to your actual number

  const progressPercent =
    step === 0 ? 0 : Math.round((step / TOTAL_QUESTIONS) * 100);

  return (
    <div className="landing-page">
      <BackgroundEffect />

      {loading && (
        <div className="loading-screen">
          <div className="loader"></div>
          <p className="text">
            Generating your AI workout... this may take a few seconds.
          </p>
        </div>
      )}

      {step === 0 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Let's Get Started</h1>
          <p>
            Lets answer some questions to see how you did to see if we need to
            change anything !
          </p>
          <br></br>
          <p>
            If don't want to change anything just hit the skip button and we
            will get your next weeks of workout ready !
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => setStep(step + 1)} label="Get Started" />
            <Button onClick={() => setStep(step + 1)} label="Next" />
            <Button
              onClick={() => {
                setSkipped(true);
                setStep(step + 6);
              }}
              label="Skip"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>How challenging was this weeks workout ?</h1>
          <div className="radio-group">
            {['Too Easy', 'Easy', 'Just Right', 'Hard', 'Too Hard'].map((q) => (
              <label key={q}>
                <input
                  type="radio"
                  value={q}
                  checked={q1 === q}
                  onChange={(e) => setQ1(e.target.value)}
                />
                {q}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q1}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>How sore were you getting ? </h1>
          <div className="radio-group">
            {['Not sore', 'Kinda Sore', 'Very Sore'].map((experience) => (
              <label key={experience}>
                <input
                  type="radio"
                  value={experience}
                  checked={q2 === experience}
                  onChange={(e) => setQ2(e.target.value)}
                />
                {experience}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q2}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Did you complete all schedule workouts this week ? </h1>
          <div className="radio-group">
            {['Yes', 'No', 'Partially'].map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  value={d}
                  checked={q3 === d}
                  onChange={(e) => setQ3(e.target.value)}
                />
                {d}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q3}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>
            Do you feel this week's workouts helped you progress toward your
            goals ?
          </h1>
          <div className="radio-group">
            {['Yes', 'Somewhat', 'No'].map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  value={d}
                  checked={q4 === d}
                  onChange={(e) => setQ4(e.target.value)}
                />
                {d}
              </label>
            ))}
          </div>

          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q4}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Write any comments that you have with this weeks workout ! </h1>

          <input
            type="text"
            placeholder="Example: 'This workout felt too easy', 'I really enjoyed the squats', 'The cardio was tough but manageable'"
            value={q5}
            onChange={(e) => setQ5(e.target.value)}
            className="text-input" // optional styling
          />

          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q5}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h2>Confirm Your Selections</h2>
          <p>
            <strong>How challenging was this weeks workout ?:</strong> {q1}
          </p>
          <p>
            <strong>How sore were you getting ?:</strong> {q2}
          </p>
          <p>
            <strong>Did you complete all schedule workouts this week ?:</strong>{' '}
            {q3}
          </p>
          <p>
            <strong>
              Do you feel this week's workouts helped you progress toward your
              goals ?:
            </strong>
            {q4}
          </p>
          <p>
            <strong>
              Write any comments that you have with this weeks workout !:
            </strong>{' '}
            {q5}
          </p>
          <p>
            Everything correct? Click Finish to generate your AI workout and
            save it.
          </p>
          <div>
            <Button
              onClick={() => {
                if (skipped) {
                  setStep(0); // go back to beginning
                  setSkipped(false); // reset skip state
                } else {
                  setStep(step - 1); // normal behavior
                }
              }}
              label="Previous Step"
            />
            <Button
              onClick={handleFinish}
              label={loading ? 'Saving...' : 'Finish'}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

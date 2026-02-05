import { useEffect, useState } from 'react';
import { Zap, Dumbbell, Trophy } from 'lucide-react';
import './UI.css';

const icons = [Dumbbell, Zap, Trophy];

export default function IconLoader({ isLoading }) {
  const [index, setIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const cycle = () => {
      setSpinning(true);

      setTimeout(() => {
        setSpinning(false);

        setIndex((prev) => (prev + 1) % icons.length);
      }, 800);
    };

    cycle();
    const interval = setInterval(cycle, 1500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  const Icon = icons[index];

  return (
    <div className="loader-wrapper">
      <div className={`coin ${spinning ? 'spin' : ''}`}>
        <Icon size={36} strokeWidth={2.2} />
      </div>
    </div>
  );
}

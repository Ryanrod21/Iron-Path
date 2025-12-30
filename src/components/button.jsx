import './components.css';

export default function Button({
  label,
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      className={`app-button ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

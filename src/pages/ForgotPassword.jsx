import { useState } from 'react';
import Button from '../components/button';
import { sendPasswordResetEmail } from '../lib/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await sendPasswordResetEmail(email);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset email sent. Check your inbox.');
    }

    setLoading(false);
  };

  return (
    <div className="form-section">
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button
        label={loading ? 'Sending...' : 'Send Reset Link'}
        onClick={handleResetPassword}
        disabled={loading || !email}
      />

      {message && <p>{message}</p>}
    </div>
  );
}

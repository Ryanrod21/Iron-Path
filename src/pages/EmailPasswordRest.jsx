import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/button';

export default function EmailPasswordRest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async () => {
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      // Hardcoded redirect URL for your Vercel site
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://iron-path-five.vercel.app/password-reset',
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <form className="form-section" onSubmit={(e) => e.preventDefault()}>
      <h2 className="login-title">Password Reset</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />

      <Button
        type="button"
        onClick={handleUpdatePassword}
        className="login-button"
        label={'Update Password'}
      />
      {message && <p className="login-message">{message}</p>}
      {error && <p className="login-message">{error}</p>}
    </form>
  );
}

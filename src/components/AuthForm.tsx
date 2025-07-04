// src/components/AuthForm.tsx
import React, { useState } from 'react';
import { apiSignUp, apiSignIn } from "../firebase/auth.action";  // your CRA helpers
import { useNavigate } from 'react-router-dom';      // or your router of choice

type Mode = 'sign-in' | 'sign-up';

export default function AuthForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'sign-up') {
        const result = await apiSignUp({ name, email, password });
        if (!result.success) {
          console.error(result.message);
          throw new Error(result.message);
        }
        alert(result.message); // “Account created successfully…”
        navigate('/sign-in');
      } else {
        const result = await apiSignIn(email, password);
        if (!result.success) {
          console.error(result.message);
          throw new Error(result.message || 'Sign‑in failed');
        }
        // At this point, the session cookie is set, so you can fetch /api/me or go to the quiz
        navigate('/quiz');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {error && <p style={errorStyle}>{error}</p>}
      <h2 style={headerStyle}>{mode === 'sign-up' ? 'Create Account' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {mode === 'sign-up' && (
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={inputStyle}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? '…' : mode === 'sign-up' ? 'Sign Up' : 'Sign In'}
        </button>

        {mode === 'sign-in' ? (
          <p style={{ textAlign: 'center', color: '#fff' }}>
            Don't have an account? <a href="/sign-up" style={{ color: '#3399ff' }}>Sign Up</a>
          </p>
        ) : (
          <p style={{ textAlign: 'center', color: '#fff' }}>
            Already have an account? <a href="/sign-in" style={{ color: '#3399ff' }}>Sign In</a>
          </p>
        )}
      </form>
    </div>
  );
}

// Styles (can be moved to CSS)
const containerStyle: React.CSSProperties = {
  maxWidth: 600,
  width: 350,
  margin: '2rem auto',
  padding: '1rem',
  background: '#1f2739',
  borderRadius: 8,
};
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff'
};
const formStyle: React.CSSProperties = {
  display: 'grid',
  gap: '1rem'
};
const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderRadius: 4,
  border: '1px solid #444',
  background: '#2e3b5e',
  color: '#fff'
};
const btnStyle: React.CSSProperties = {
  padding: '0.75rem',
  border: 'none',
  borderRadius: 4,
  background: '#3399ff',
  color: '#fff',
  cursor: 'pointer'
};
const errorStyle: React.CSSProperties = {
  color: 'salmon',
  textAlign: 'center'
};

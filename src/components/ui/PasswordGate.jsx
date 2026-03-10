import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'clutch-case-study-auth';

const PasswordGate = ({ password, children }) => {
  const [input, setInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === password) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setInput('');
    }
  };

  if (authenticated) return children;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background, #1d1d1d)',
      padding: '2rem'
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '360px',
        width: '100%'
      }}>
        <p style={{
          color: 'var(--text-secondary, #a8a8a8)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          margin: 0
        }}>
          This case study is password-protected. Enter the password to continue.
        </p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            backgroundColor: 'var(--card-bg, #2a2a2a)',
            border: error ? '1px solid #C0392B' : '1px solid var(--border, #333)',
            borderRadius: '6px',
            color: 'var(--text-primary, #fff)',
            outline: 'none'
          }}
        />
        {error && (
          <p style={{ color: '#C0392B', fontSize: '0.8125rem', margin: 0 }}>
            Incorrect password
          </p>
        )}
        <button type="submit" style={{
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          backgroundColor: 'var(--text-primary, #fff)',
          color: 'var(--background, #1d1d1d)',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          View Case Study
        </button>
      </form>
    </div>
  );
};

export default PasswordGate;

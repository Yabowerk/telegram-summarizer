import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

/**
 * Login Page Component
 * 
 * Dedicated login page with email/password authentication.
 * 
 * @param {Object} props
 * @param {Function} props.onLogin - Callback (user) => void after successful login
 */
const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message || 'Invalid email or password');
      } else if (data) {
        onLogin(data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shellStyle = {
    maxWidth: '380px',
    margin: '0 auto',
    padding: '70px 20px 40px',
  };

  const wordmarkStyle = {
    fontFamily: "'Instrument Serif', serif",
    fontSize: '26px',
    fontStyle: 'italic',
    letterSpacing: '0.2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '9px',
    marginBottom: '8px',
  };

  const dotStyle = {
    display: 'inline-block',
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    background: 'var(--accent)',
  };

  const subStyle = {
    textAlign: 'center',
    color: 'var(--text-faint)',
    fontSize: '14px',
    marginBottom: '34px',
  };

  const cardStyle = {
    background: 'var(--surface)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid var(--hairline)',
    borderRadius: 'var(--radius-lg)',
    padding: '26px',
  };

  const fieldStyle = {
    marginBottom: '16px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12.5px',
    color: 'var(--text-faint)',
    marginBottom: '7px',
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-soft)',
    border: '1px solid var(--hairline)',
    color: 'var(--text)',
    borderRadius: 'var(--radius-sm)',
    padding: '11px 13px',
    fontSize: '14.5px',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  };

  const errorStyle = {
    fontSize: '13px',
    color: '#f87171',
    marginBottom: '12px',
    textAlign: 'center',
  };

  const submitStyle = {
    width: '100%',
    background: loading ? 'var(--accent)' : 'var(--accent)',
    color: '#062017',
    fontWeight: '700',
    borderRadius: 'var(--radius-md)',
    padding: '13px 14px',
    fontSize: '14.5px',
    marginTop: '6px',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    transition: 'background 0.15s ease',
  };

  const switchStyle = {
    textAlign: 'center',
    fontSize: '13.5px',
    color: 'var(--text-faint)',
    marginTop: '20px',
  };

  const linkStyle = {
    color: 'var(--accent-soft)',
    fontWeight: '500',
    textDecoration: 'none',
  };

  const backLinkStyle = {
    textAlign: 'center',
    fontSize: '13.5px',
    color: 'var(--text-faint)',
    marginTop: '12px',
  };

  return (
    <div style={shellStyle} className="auth-shell">
      <Link to="/" style={wordmarkStyle} className="wordmark">
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.48-1.12 7.28-.16.9-.48 1.2-.78 1.23-.66.06-1.16-.44-1.8-.86-.99-.65-1.55-1.05-2.52-1.68-1.12-.74-.39-1.14.24-1.8.16-.18 2.92-2.68 2.98-2.91.01-.07.01-.33-.12-.47-.13-.13-.32-.08-.46-.05-.2.05-3.41 2.18-4.63 3.02-.43.29-.82.45-1.18.44-.39-.01-1.13-.22-1.68-.41-.68-.22-1.21-.34-1.16-.72.03-.2.27-.4.71-.6 2.85-1.24 4.75-2.06 5.7-3.45.47-.66.78-1.71.78-2.76 0-.48 0-.96-.07-1.42z" fill="white"/>
        </svg>
        <span>Post Summarizer</span>
      </Link>

      <p style={subStyle} className="auth-sub">
        Log in to see your saved channels
      </p>

      <div style={cardStyle} className="auth-card">
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle} className="auth-field">
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-soft)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--hairline)'}
            />
          </div>

          <div style={fieldStyle} className="auth-field">
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-soft)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--hairline)'}
            />
          </div>

          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={submitStyle}
            className="auth-submit"
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = 'var(--accent-soft)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--accent)';
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>

      <div style={switchStyle} className="auth-switch">
        No account?{' '}
        <Link to="/signup" style={linkStyle}>
          Sign up
        </Link>
      </div>

    </div>
  );
};

export default Login;

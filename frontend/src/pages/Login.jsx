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
        <span style={dotStyle} className="dot"></span>
        <span>Digest</span>
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

      <div style={backLinkStyle} className="auth-switch">
        <Link 
          to="/" 
          style={{ color: 'var(--text-faint)', textDecoration: 'none', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-soft)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-faint)'}
        >
          Back to Digest
        </Link>
      </div>
    </div>
  );
};

export default Login;

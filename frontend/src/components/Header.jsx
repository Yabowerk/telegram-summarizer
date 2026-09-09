import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header Component
 * 
 * Top navigation bar with Digest wordmark and authentication controls.
 * Shows logout button and user chip when authenticated.
 * 
 * @param {Object} props
 * @param {boolean} props.auth - Whether user is authenticated
 * @param {Object} props.user - User data { name, email }
 * @param {Function} props.onLogout - Logout handler
 */
const Header = ({ auth, user, onLogout }) => {
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px 0 8px',
  };

  const wordmarkStyle = {
    fontFamily: "'Instrument Serif', serif",
    fontSize: '26px',
    fontStyle: 'italic',
    letterSpacing: '0.2px',
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
  };

  const dotStyle = {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    background: 'var(--accent)',
    display: 'inline-block',
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  };

  const userChipStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13.5px',
    color: 'var(--text-dim)',
  };

  const avatarStyle = {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'var(--surface-hi)',
    border: '1px solid var(--hairline)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--accent-soft)',
  };

  const logoutButtonStyle = {
    background: 'none',
    border: '1px solid var(--hairline)',
    color: 'var(--text-dim)',
    padding: '7px 16px',
    borderRadius: '100px',
    fontSize: '13.5px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  return (
    <header style={headerStyle} className="top">
      <Link to="/" style={wordmarkStyle} className="wordmark">
        <span style={dotStyle} className="dot"></span>
        <span>Digest</span>
      </Link>
      
      {auth && (
        <div style={userSectionStyle}>
          <div style={userChipStyle} className="user-chip">
            <div style={avatarStyle} className="av">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span>{user?.name || 'User'}</span>
          </div>
          <button
            style={logoutButtonStyle}
            onClick={onLogout}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--accent-soft)';
              e.target.style.color = 'var(--accent-soft)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--hairline)';
              e.target.style.color = 'var(--text-dim)';
            }}
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

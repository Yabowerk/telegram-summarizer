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
    overflow: 'hidden',
  };

  const avatarImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
        <svg width="35
        " height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.48-1.12 7.28-.16.9-.48 1.2-.78 1.23-.66.06-1.16-.44-1.8-.86-.99-.65-1.55-1.05-2.52-1.68-1.12-.74-.39-1.14.24-1.8.16-.18 2.92-2.68 2.98-2.91.01-.07.01-.33-.12-.47-.13-.13-.32-.08-.46-.05-.2.05-3.41 2.18-4.63 3.02-.43.29-.82.45-1.18.44-.39-.01-1.13-.22-1.68-.41-.68-.22-1.21-.34-1.16-.72.03-.2.27-.4.71-.6 2.85-1.24 4.75-2.06 5.7-3.45.47-.66.78-1.71.78-2.76 0-.48 0-.96-.07-1.42z" fill="white"/>
        </svg>
        <span>Post Summarizer</span>
      </Link>
      
      {auth && (
        <div style={userSectionStyle}>
          <div style={userChipStyle} className="user-chip">
            <div style={avatarStyle} className="av">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || 'User'} 
                  style={avatarImageStyle}
                />
              ) : (
                user?.name?.[0]?.toUpperCase() || 'U'
              )}
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

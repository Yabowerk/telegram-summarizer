import React from 'react';

/**
 * ChannelPill Component
 * 
 * Individual channel avatar pill displayed in the channel strip.
 * Shows channel emoji/initial, name label, and ring style based on type (saved/recent).
 * 
 * @param {Object} props
 * @param {Object} props.channel - Channel data { handle, label, emoji }
 * @param {string} props.type - 'saved' | 'recent' - determines ring styling
 * @param {Function} props.onClick - Click handler
 */
const ChannelPill = ({ channel, type, onClick }) => {
  const ringStyle = type === 'saved' 
    ? { background: 'var(--ring-saved)', padding: '1px' }
    : { background: 'var(--hairline)', padding: '1px' };

  const chanStyle = {
    flex: '0 0 auto',
    width: '66px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '7px',
    background: 'none',
    border: 'none',
    color: 'var(--text-dim)',
    cursor: 'pointer',
  };

  const ringContainerStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...ringStyle,
  };

  const avatarStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'var(--surface-hi)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '17px',
    fontWeight: '600',
    color: 'var(--text)',
    border: '2px solid var(--bg)',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  };

  const nameStyle = {
    fontSize: '11.5px',
    color: 'var(--text-dim)',
    maxWidth: '66px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <button
      style={chanStyle}
      className="chan"
      onClick={onClick}
      onMouseEnter={(e) => {
        const nameEl = e.currentTarget.querySelector('.name');
        if (nameEl) nameEl.style.color = 'var(--text)';
      }}
      onMouseLeave={(e) => {
        const nameEl = e.currentTarget.querySelector('.name');
        if (nameEl) nameEl.style.color = 'var(--text-dim)';
      }}
    >
      <div style={ringContainerStyle} className="ring">
        <div style={avatarStyle} className="avatar">
          {channel.photoBase64 ? (
            <img 
              src={channel.photoBase64} 
              alt={channel.title || channel.label || "Channel"} 
              style={imageStyle}
            />
          ) : (
            channel.emoji
          )}
        </div>
      </div>
      <div style={nameStyle} className="name">
        {channel.label}
      </div>
    </button>
  );
};

export default ChannelPill;

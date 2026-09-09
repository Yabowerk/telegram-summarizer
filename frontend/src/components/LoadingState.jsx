import React from 'react';

/**
 * LoadingState Component
 * 
 * Displays animated spinner with loading message during summary generation.
 * 
 * @param {Object} props
 * @param {string} props.channel - Channel name being processed
 */
const LoadingState = ({ channel = '@channelname' }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    padding: '46px 0',
    color: 'var(--text-faint)',
    fontSize: '13.5px',
  };

  const spinnerStyle = {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    border: '2.5px solid var(--hairline)',
    borderTopColor: 'var(--accent)',
  };

  return (
    <div style={containerStyle} className="loading">
      <div style={spinnerStyle} className="spinner animate-spin"></div>
      <span>Reading {channel}'s posts…</span>
    </div>
  );
};

export default LoadingState;

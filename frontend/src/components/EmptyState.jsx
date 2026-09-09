import React from 'react';

/**
 * EmptyState Component
 * 
 * Displays empty state when no posts are found in the selected date range.
 * 
 * @param {Object} props
 * @param {string} props.channel - Channel name
 * @param {string} props.rangeLabel - Date range label for display
 */
const EmptyState = ({ channel = '@channelname', rangeLabel = 'Today' }) => {
  const containerStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--text-faint)',
  };

  const glyphStyle = {
    fontSize: '28px',
    marginBottom: '12px',
    opacity: 0.7,
  };

  const titleStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '15px',
    color: 'var(--text)',
    fontWeight: '600',
    marginBottom: '6px',
  };

  const textStyle = {
    fontSize: '13.5px',
    lineHeight: '1.5',
    maxWidth: '320px',
    margin: '0 auto',
  };

  return (
    <div style={containerStyle} className="empty-state">
      <div style={glyphStyle} className="glyph">◌</div>
      <h4 style={titleStyle}>
        No posts in this range
      </h4>
      <p style={textStyle}>
        {channel} didn't publish anything between {rangeLabel}. Try today, or widen the custom range.
      </p>
    </div>
  );
};

export default EmptyState;

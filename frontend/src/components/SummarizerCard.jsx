import React from 'react';
import CustomDateRange from './CustomDateRange';

/**
 * SummarizerCard Component
 * 
 * Main input card for channel username and date range selection.
 * Contains input field, date range toggle buttons, custom date picker, and submit button.
 * 
 * @param {Object} props
 * @param {string} props.channelInput - Current channel username
 * @param {Function} props.setChannelInput - Update channel input
 * @param {string} props.dateRange - 'today' | 'custom'
 * @param {Function} props.toggleDateRange - Toggle date range type
 * @param {Object} props.customDates - { from: string, to: string }
 * @param {Function} props.setCustomDates - Update custom dates
 * @param {Function} props.onSubmit - Submit handler for getting summary
 * @param {boolean} props.loading - Whether summary is being fetched
 */
const SummarizerCard = ({ 
  channelInput, 
  setChannelInput, 
  dateRange, 
  toggleDateRange, 
  customDates, 
  setCustomDates, 
  onSubmit,
  loading 
}) => {
  const handleCustomDateChange = (field, value) => {
    setCustomDates({ ...customDates, [field]: value });
  };

  const cardStyle = {
    background: 'var(--surface)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid var(--hairline)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px',
    marginTop: '6px',
  };

  const fieldLabelStyle = {
    fontSize: '12.5px',
    color: 'var(--text-faint)',
    marginBottom: '8px',
  };

  const inputRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--bg-soft)',
    border: '1px solid var(--hairline)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    transition: 'border-color 0.15s ease',
  };

  const inputStyle = {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text)',
    fontSize: '15px',
    outline: 'none',
  };

  const rangeRowStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '14px',
  };

  const getRangeButtonStyle = (isActive) => ({
    flex: 1,
    background: isActive ? 'var(--accent-dim)' : 'var(--bg-soft)',
    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--hairline)'}`,
    color: isActive ? 'var(--text)' : 'var(--text-dim)',
    borderRadius: 'var(--radius-md)',
    padding: '11px 12px',
    fontSize: '13.5px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  });

  const submitButtonStyle = {
    width: '100%',
    marginTop: '16px',
    background: loading ? 'var(--accent)' : 'var(--accent)',
    color: '#062017',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    transition: 'transform 0.12s ease, background 0.15s ease',
  };

  return (
    <section style={cardStyle} className="card">
      <div style={fieldLabelStyle} className="field-label">
        Channel username
      </div>
      
      <div 
        style={inputRowStyle} 
        className="input-row"
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-soft)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--hairline)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.55 }}>
          <path d="M21 3L2 10.5l6 2.5m13-10L15.5 20l-4.5-7.5m10-9.5L7.5 13" stroke="#F3E8E7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          id="channelInput"
          placeholder="@channelname"
          value={channelInput}
          onChange={(e) => setChannelInput(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={rangeRowStyle} className="range-row">
        <button
          style={getRangeButtonStyle(dateRange === 'today')}
          onClick={() => toggleDateRange('today')}
          onMouseEnter={(e) => {
            if (dateRange !== 'today') {
              e.target.style.borderColor = 'var(--text-faint)';
            }
          }}
          onMouseLeave={(e) => {
            if (dateRange !== 'today') {
              e.target.style.borderColor = 'var(--hairline)';
            }
          }}
        >
          Today
        </button>
        <button
          style={getRangeButtonStyle(dateRange === 'custom')}
          onClick={() => toggleDateRange('custom')}
          onMouseEnter={(e) => {
            if (dateRange !== 'custom') {
              e.target.style.borderColor = 'var(--text-faint)';
            }
          }}
          onMouseLeave={(e) => {
            if (dateRange !== 'custom') {
              e.target.style.borderColor = 'var(--hairline)';
            }
          }}
        >
          Custom range
        </button>
      </div>

      <CustomDateRange
        customDates={customDates}
        onChange={handleCustomDateChange}
        show={dateRange === 'custom'}
      />

      <button
        style={submitButtonStyle}
        className="submit-btn"
        onClick={onSubmit}
        disabled={loading}
        onMouseEnter={(e) => {
          if (!loading) e.target.style.background = 'var(--accent-soft)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'var(--accent)';
        }}
        onMouseDown={(e) => {
          if (!loading) e.target.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {loading ? 'Getting summary...' : 'Get summary'}
      </button>
    </section>
  );
};

export default SummarizerCard;

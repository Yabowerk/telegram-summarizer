import React from 'react';

/**
 * CustomDateRange Component
 * 
 * Date picker row for selecting custom date range (from/to).
 * Appears when user selects "Custom range" option.
 * 
 * @param {Object} props
 * @param {Object} props.customDates - { from: string, to: string }
 * @param {Function} props.onChange - Callback (field, value) => void
 * @param {boolean} props.show - Whether to display the component
 */
const CustomDateRange = ({ customDates, onChange, show }) => {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  if (!show) return null;

  const containerStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  };

  const fieldWrapperStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const labelStyle = {
    fontSize: '12px',
    color: 'var(--text-dim)',
  };

  const inputStyle = {
    flex: 1,
    background: 'var(--bg-soft)',
    border: '1px solid var(--hairline)',
    color: 'var(--text)',
    borderRadius: 'var(--radius-sm)',
    padding: '9px 11px',
    fontSize: '13.5px',
    transition: 'border-color 0.15s ease',
  };

  return (
    <div style={containerStyle} className="custom-dates">
      <div style={fieldWrapperStyle}>
        <label htmlFor="dateFrom" style={labelStyle}>Start date</label>
      <input
        type="date"
        id="dateFrom"
        value={customDates.from}
        onChange={handleChange('from')}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent-soft)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--hairline)'}
      />
      </div>
      
      <div style={fieldWrapperStyle}>
        <label htmlFor="dateTo" style={labelStyle}>End date</label>
      <input
        type="date"
        id="dateTo"
        value={customDates.to}
        onChange={handleChange('to')}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent-soft)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--hairline)'}
      />
    </div>
    </div>
  );
};

export default CustomDateRange;

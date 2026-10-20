import React, { useRef, useEffect } from 'react';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const ListItem = ({ children }) => (
  <li className="summary-list-item">
    <div className="summary-list-item-content">
      {children}
    </div>
  </li>
);

/**
 * Custom Strong component for ReactMarkdown
 * Styles bold text (titles) with accent color and larger font
 */
const Strong = ({ children }) => (
  <strong className="summary-list-item-title">{children}</strong>
);

/**
 * SummaryResults Component
 * 
 * Displays summary results, loading state, or empty state.
 * Shows channel metadata, summary content, and save channel button.
 * 
 * @param {Object} props
 * @param {boolean} props.loading - Whether summary is being fetched
 * @param {Object} props.results - Summary results data or null
 * @param {string} props.channelInput - Current channel for loading state
 * @param {string} props.rangeLabel - Date range label for display
 * @param {Function} props.onToggleSave - Callback to save/unsave channel
 * @param {boolean} props.isSaved - Whether current channel is saved
 */
const SummaryResults = ({ 
  loading, 
  results, 
  channelInput, 
  rangeLabel,
  onToggleSave,
  isSaved
}) => {
  // Ref to the results section for auto-scroll
  const resultsRef = useRef(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  // Loading state
  if (loading) {
    return (
      <section style={{ marginTop: '26px', minHeight: '40px' }} className="results">
        <LoadingState channel={channelInput || '@channelname'} />
      </section>
    );
  }

  // Empty state - no results yet or no posts found
  if (!results) {
    return null;
  }

  if (results.empty) {
    return (
      <section style={{ marginTop: '26px', minHeight: '40px' }} className="results">
        <EmptyState channel={results.channel} rangeLabel={rangeLabel} />
      </section>
    );
  }

  // Success state - display summary
  const channelFirstChar = results.channel?.replace('@', '')[0]?.toUpperCase() || 'C';

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  };

  const avatarStyle = {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'var(--surface-hi)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    border: '1px solid var(--hairline)',
  };

  const infoContainerStyle = {
    flex: 1,
  };

  const whoStyle = {
    fontSize: '14.5px',
    fontWeight: '600',
    color: 'var(--text)',
  };

  const whenStyle = {
    fontSize: '12.5px',
    color: 'var(--text-faint)',
    marginTop: '1px',
  };

  const saveButtonStyle = {
    marginLeft: 'auto',
    background: 'none',
    border: '1px solid var(--hairline)',
    color: 'var(--text-dim)',
    borderRadius: '100px',
    padding: '6px 13px',
    fontSize: '12.5px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const bodyStyle = {
    borderLeft: '2px solid var(--accent-dim)',
    paddingLeft: '25px',
  };

  const titleStyle = {
    fontFamily: "'Instrument Serif', serif",
    fontWeight: '400',
    fontStyle: 'italic',
    fontSize: '22px',
    lineHeight: '1.3',
    marginBottom: '10px',
    color: 'var(--text)',
  };

  const paragraphStyle = {
    fontFamily: "'Instrument Serif', serif",
    fontSize: '18px',
    lineHeight: '1.6',
    color: 'var(--text-dim)',
    marginBottom: '14px',
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginTop: '18px',
    fontSize: '12.5px',
    color: 'var(--text-faint)',
  };

  const spanStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  return (
    <section style={{ marginTop: '26px', minHeight: '40px' }} className="results" ref={resultsRef}>
      <div style={metaStyle} className="result-meta">
        <div style={avatarStyle} className="avatar">
          {channelFirstChar}
        </div>
        <div style={infoContainerStyle}>
          <div style={whoStyle} className="who">{results.channel}</div>
          <div style={whenStyle} className="when">{rangeLabel}</div>
        </div>
        <button
          style={saveButtonStyle}
          className="save-toggle"
          onClick={() => onToggleSave(results.channel)}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--gold)';
            e.target.style.color = 'var(--gold)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--hairline)';
            e.target.style.color = 'var(--text-dim)';
          }}
        >
          {isSaved ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      <div style={bodyStyle} className="result-body">
        <h3 style={titleStyle}>
          {results.title}
        </h3>
        <div className="summary-glass-container">
          <div className="prose prose-invert max-w-none">
            {Array.isArray(results.summary) && results.summary.map((paragraph, index) => (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                components={{
                  li: ListItem,
                  strong: Strong,
                  ol: ({ children }) => <ol className="summary-list">{children}</ol>,
                  ul: ({ children }) => <ul className="summary-list">{children}</ul>,
                  table: ({ children }) => (
      <div style={{ overflowX: 'auto', margin: '16px 0' }}>
        <table>{children}</table>
      </div>
    ),
                }}
              >
                {paragraph}
              </ReactMarkdown>
            ))}
          </div>
        </div>
      </div>

      <div style={footerStyle} className="result-footer">
        <span style={spanStyle}>{results.postCount || 0} posts</span>
        <span style={spanStyle}>{results.threadCount || 0} threads</span>
        <span style={spanStyle}>Generated just now</span>
      </div>
    </section>
  );
};

export default SummaryResults;

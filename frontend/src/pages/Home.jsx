import React, { useRef, useEffect } from 'react';
import Header from '../components/Header';
import ChannelStrip from '../components/ChannelStrip';
import SummarizerCard from '../components/SummarizerCard';
import SummaryResults from '../components/SummaryResults';
import { useSummarizer } from '../hooks/useSummarizer';

/**
 * Home Page Component
 * 
 * Main application page showing channel strip, summarizer card, and results.
 * Uses useSummarizer custom hook for all state management.
 * Protected route - only accessible when authenticated.
 * 
 * @param {Object} props
 * @param {boolean} props.auth - Whether user is authenticated
 * @param {Object} props.user - User data
 * @param {Function} props.onLogout - Logout handler
 */
const Home = ({ auth, user, onLogout }) => {
  const {
    // State
    channelInput,
    dateRange,
    customDates,
    activeStrip,
    recentChannels,
    savedChannels,
    loading,
    results,

    // Setters
    setChannelInput,
    setActiveStrip,
    setCustomDates,

    // Actions
    getSummary,
    toggleSaveChannel,
    pickChannel,
    toggleDateRange,
    isChannelSaved,
    getCurrentRangeLabel,
  } = useSummarizer();

  const channelInputRef = useRef(null);

  // Handle channel pick - focus input when "New" is clicked
  const handlePickChannel = (handle) => {
    if (handle) {
      pickChannel(handle);
    } else {
      // Focus input for new channel
      channelInputRef.current?.focus();
    }
  };

  return (
    <div className="shell">
      <main className="app" style={{ display: 'block' }}>
        <Header auth={auth} user={user} onLogout={onLogout} />
        
        <ChannelStrip
          activeStrip={activeStrip}
          setActiveStrip={setActiveStrip}
          recentChannels={recentChannels}
          savedChannels={savedChannels}
          onPickChannel={handlePickChannel}
        />
        
        <SummarizerCard
          channelInput={channelInput}
          setChannelInput={setChannelInput}
          dateRange={dateRange}
          toggleDateRange={toggleDateRange}
          customDates={customDates}
          setCustomDates={setCustomDates}
          onSubmit={getSummary}
          loading={loading}
        />
        
        <SummaryResults
          loading={loading}
          results={results}
          channelInput={channelInput}
          rangeLabel={getCurrentRangeLabel()}
          onToggleSave={toggleSaveChannel}
          isSaved={results?.channel ? isChannelSaved(results.channel) : false}
        />
      </main>
    </div>
  );
};

export default Home;

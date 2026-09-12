import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

/**
 * Custom Hook: useSummarizer
 * 
 * Central state management for the Digest Telegram Summarizer app.
 * Manages all channel data, user input, date ranges, API calls, and results.
 * 
 * @returns {Object} Hook state and actions
 * 
 * STATE:
 * - channelInput: Current channel username input (string)
 * - dateRange: 'today' or 'custom' (string)
 * - customDates: { from: string, to: string } - ISO date strings
 * - activeStrip: 'recent' or 'saved' (string)
 * - recentChannels: Array of recently searched channels
 * - savedChannels: Array of saved channels
 * - loading: Boolean - true when fetching summary
 * - results: Object | null - summary results or null
 * - error: String | null - error message if any
 * 
 * ACTIONS:
 * - fetchChannels(): Fetch channels from backend
 * - getSummary(): Get summary based on current input and date range
 * - toggleSaveChannel(channelName): Save/unsave a channel
 * - pickChannel(handle): Auto-fill channel input from strip
 * - toggleDateRange(type): Switch between 'today' and 'custom'
 * - setChannelInput(value): Update channel input
 * - setActiveStrip(type): Switch between 'recent' and 'saved' strips
 * - setCustomDates(dates): Update custom date range
 */
export const useSummarizer = () => {
  // Input state
  const [channelInput, setChannelInput] = useState('@northlightnews');
  const [dateRange, setDateRange] = useState('today'); // 'today' | 'custom'
  const [customDates, setCustomDates] = useState({ from: '', to: '' });

  // UI state
  const [activeStrip, setActiveStrip] = useState('recent'); // 'recent' | 'saved'

  // Data state
  const [recentChannels, setRecentChannels] = useState([]);
  const [savedChannels, setSavedChannels] = useState([]);

  // Results state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Fetch channels from backend on mount
   * Populates recentChannels and savedChannels
   */
  const fetchChannels = useCallback(async () => {
    try {
      const data = await api.fetchChannels();
      setRecentChannels(data.recent || []);
      setSavedChannels(data.saved || []);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError('Failed to load channels');
    }
  }, []);

  /**
   * Get summary for the current channel and date range
   * Calls appropriate API endpoint based on dateRange state
   */
  const getSummary = useCallback(async () => {
    const channel = channelInput.trim();
    
    if (!channel) {
      setError('Please enter a channel username');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let data;

      if (dateRange === 'today') {
        data = await api.getTodaySummary(channel);
      } else {
        // Custom range
        const { from, to } = customDates;
        
        if (!from || !to) {
          setError('Please select both start and end dates');
          setLoading(false);
          return;
        }

        data = await api.getRangeSummary(channel, from, to);
      }

      if (data.empty) {
        setResults({ empty: true, channel: data.channel });
      } else {
        setResults(data);
        // Add to recent channels (prepend, avoid duplicates)
        setRecentChannels((prev) => {
          const exists = prev.find((ch) => ch.handle === channel);
          if (exists) return prev;
          
          const firstLetter = channel.replace('@', '')[0]?.toUpperCase() || 'C';
          const newChannel = {
            handle: channel,
            label: channel.replace('@', '').slice(0, 5),
            emoji: firstLetter,
          };
          
          return [newChannel, ...prev].slice(0, 8); // Keep max 8 recent
        });
      }
    } catch (err) {
      console.error('Error getting summary:', err);
      setError(err.message || 'Failed to get summary');
    } finally {
      setLoading(false);
    }
  }, [channelInput, dateRange, customDates]);

  /**
   * Toggle save status of a channel
   * Adds to savedChannels or removes from it
   * Makes API call to backend to persist the change
   */
  const toggleSaveChannel = useCallback(async (channelName) => {
    try {
      const isSaved = savedChannels.some((ch) => ch.handle === channelName);

      if (isSaved) {
        // Move to recent (unsave)
        const response = await api.addChannel(channelName, 'recent');
        
        if (response.success) {
          // Remove from saved channels
          setSavedChannels((prev) => prev.filter((ch) => ch.handle !== channelName));
          
          // Add to recent channels if not already there
          setRecentChannels((prev) => {
            const exists = prev.find((ch) => ch.handle === channelName);
            if (exists) return prev;
            
            const firstLetter = channelName.replace('@', '')[0]?.toUpperCase() || 'C';
            const newChannel = {
              handle: channelName,
              label: channelName.replace('@', '').slice(0, 5),
              emoji: firstLetter,
            };
            return [newChannel, ...prev].slice(0, 8); // Keep max 8 recent
          });
        }
      } else {
        // Add to saved
        const response = await api.addChannel(channelName, 'saved');
        
        if (response.success) {
          const firstLetter = channelName.replace('@', '')[0]?.toUpperCase() || 'C';
          const newChannel = {
            handle: channelName,
            label: channelName.replace('@', '').slice(0, 5),
            emoji: firstLetter,
          };
          setSavedChannels((prev) => [newChannel, ...prev]);
          
          // Remove from recent if it exists there
          setRecentChannels((prev) => prev.filter((ch) => ch.handle !== channelName));
        }
      }
    } catch (err) {
      console.error('Error toggling save channel:', err);
      setError('Failed to save channel');
    }
  }, [savedChannels]);

  /**
   * Pick a channel from the strip and auto-fill input
   * @param {string} handle - Channel handle (e.g., '@channelname')
   */
  const pickChannel = useCallback((handle) => {
    if (handle) {
      setChannelInput(handle);
    }
  }, []);

  /**
   * Toggle between 'today' and 'custom' date range
   * @param {string} type - 'today' | 'custom'
   */
  const toggleDateRange = useCallback((type) => {
    setDateRange(type);
  }, []);

  /**
   * Check if a channel is currently saved
   * @param {string} channelName - Channel handle
   * @returns {boolean}
   */
  const isChannelSaved = useCallback((channelName) => {
    return savedChannels.some((ch) => ch.handle === channelName);
  }, [savedChannels]);

  /**
   * Get current date range label for display
   * @returns {string} Display label for current date range
   */
  const getCurrentRangeLabel = useCallback(() => {
    if (dateRange === 'today') return 'Today';
    
    const { from, to } = customDates;
    if (from && to) return `${from} to ${to}`;
    if (from) return `${from} to ?`;
    if (to) return `? to ${to}`;
    return 'Custom range';
  }, [dateRange, customDates]);

  // Fetch channels on mount
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return {
    // State
    channelInput,
    dateRange,
    customDates,
    activeStrip,
    recentChannels,
    savedChannels,
    loading,
    results,
    error,

    // Setters
    setChannelInput,
    setActiveStrip,
    setCustomDates,

    // Actions
    fetchChannels,
    getSummary,
    toggleSaveChannel,
    pickChannel,
    toggleDateRange,
    isChannelSaved,
    getCurrentRangeLabel,
  };
};

export default useSummarizer;

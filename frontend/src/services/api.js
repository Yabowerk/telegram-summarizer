/**
 * API Service for Digest Telegram Summarizer
 * Handles all backend communication with fallback mock data
 */

const API_BASE_URL = 'http://localhost:3000';

// Mock data for fallback
const mockRecentChannels = [
  { handle: '@northlightnews', label: 'North', emoji: 'N' },
  { handle: '@cryptodaily', label: 'Crypto', emoji: 'C' },
  { handle: '@filmnoir_hub', label: 'Noir', emoji: 'F' },
  { handle: '@aiweekly', label: 'AI Wkly', emoji: 'A' },
  { handle: '@markets_am', label: 'Markets', emoji: 'M' },
];

const mockSavedChannels = [
  { handle: '@northlightnews', label: 'North', emoji: 'N' },
  { handle: '@designtelegram', label: 'Design', emoji: 'D' },
  { handle: '@longreads_et', label: 'Reads', emoji: 'L' },
];

const mockSummaryResult = {
  channel: '@northlightnews',
  title: 'A quiet week of policy shifts and one product launch',
  summary: [
    'The channel opened with a rundown of a regulatory hearing that\'s likely to affect small publishers, followed by a short explainer thread breaking the ruling into plain terms. Reactions from readers were mixed, with several long comment threads debating enforcement timelines.',
    'Midweek brought the bigger story: a product launch from a competitor, covered with screenshots and a first-look reaction. The channel closed out with a roundup of five links worth reading and a note about an upcoming livestream.'
  ],
  postCount: 14,
  threadCount: 3,
  timestamp: new Date().toISOString()
};

/**
 * Fetch all channels (recent and saved)
 * GET /channels?type=recent or GET /channels?type=saved
 */
export const fetchChannels = async () => {
  try {
    // Fetch recent channels
    const recentResponse = await fetch(`${API_BASE_URL}/channels?type=recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // Fetch saved channels
    const savedResponse = await fetch(`${API_BASE_URL}/channels?type=saved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!recentResponse.ok || !savedResponse.ok) {
      throw new Error('HTTP error fetching channels');
    }

    const recentData = await recentResponse.json();
    const savedData = await savedResponse.json();

    // Transform backend format to frontend format
    const transformChannels = (channels) => {
      return channels.map((ch) => ({
        handle: ch.channelUsername,
        label: ch.channelTitle?.slice(0, 6) || ch.channelUsername.slice(0, 6),
        emoji: ch.channelTitle?.[0]?.toUpperCase() || ch.channelUsername[0]?.toUpperCase() || 'C',
        photoBase64: ch.photoBase64, // Profile picture
        title: ch.channelTitle,
      }));
    };

    return {
      recent: transformChannels(recentData || []),
      saved: transformChannels(savedData || []),
    };
  } catch (error) {
    console.warn('Backend not available, using mock data:', error.message);
    return {
      recent: mockRecentChannels,
      saved: mockSavedChannels,
    };
  }
};

/**
 * Get summary for today
 * POST /:channelUsername/today/summary
 */
export const getTodaySummary = async (channelUsername) => {
  try {
    const cleanChannel = channelUsername.replace('@', '');
    const response = await fetch(`${API_BASE_URL}/${cleanChannel}/today/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { empty: true, channel: channelUsername };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle backend response format
    if (data.summary === "No messages found for today.") {
      return { empty: true, channel: channelUsername };
    }
    
    return {
      channel: channelUsername,
      title: 'Summary for Today',
      summary: [data.summarized || data.summary || ''],
      postCount: data.postnumber || 0,
      threadCount: 0,
      timestamp: new Date().toISOString(),
      empty: false,
    };
  } catch (error) {
    console.warn('Backend not available, using mock data:', error.message);
    return {
      ...mockSummaryResult,
      channel: channelUsername,
    };
  }
};

/**
 * Get summary for custom date range
 * POST /:channelUsername/range/summary?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
export const getRangeSummary = async (channelUsername, fromDate, toDate) => {
  try {
    const cleanChannel = channelUsername.replace('@', '');
    const url = `${API_BASE_URL}/${cleanChannel}/range/summary?start=${fromDate}&end=${toDate}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { empty: true, channel: channelUsername, fromDate, toDate };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle backend response format
    if (data.summary === "No messages found") {
      return { empty: true, channel: channelUsername, fromDate, toDate };
    }
    
    return {
      channel: channelUsername,
      title: `Summary from ${fromDate} to ${toDate}`,
      summary: [data.summary || ''],
      postCount: data.postcount || 0,
      threadCount: 0,
      timestamp: new Date().toISOString(),
      fromDate,
      toDate,
      empty: false,
    };
  } catch (error) {
    console.warn('Backend not available, using mock data:', error.message);
    return {
      ...mockSummaryResult,
      channel: channelUsername,
      fromDate,
      toDate,
    };
  }
};

/**
 * Add/Save a channel
 * POST /:channelusername/addingchannel
 */
export const addChannel = async (channelUsername, type = 'saved') => {
  try {
    const cleanChannel = channelUsername.replace('@', '');
    const response = await fetch(`${API_BASE_URL}/${cleanChannel}/addingchannel?type=${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Channel saved successfully',
    };
  } catch (error) {
    console.warn('Backend not available, using mock response:', error.message);
    return {
      success: true,
      message: 'Channel saved (mock mode)',
    };
  }
};

/**
 * User authentication - Login
 * Uses Better Auth client
 */
export const login = async (email, password) => {
  // Better Auth handles this via the client
  // This is kept for compatibility but will be replaced by direct client usage
  throw new Error('Use authClient.signIn directly');
};

/**
 * User authentication - Signup
 * Uses Better Auth client
 */
export const signup = async (name, email, password) => {
  // Better Auth handles this via the client
  // This is kept for compatibility but will be replaced by direct client usage
  throw new Error('Use authClient.signUp directly');
};

export default {
  fetchChannels,
  getTodaySummary,
  getRangeSummary,
  addChannel,
  login,
  signup,
};

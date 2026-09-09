import React from 'react';
import ChannelPill from './ChannelPill';

/**
 * ChannelStrip Component
 * 
 * Horizontal scrollable strip of channel avatars.
 * Shows recently searched or saved channels with switcher toggle.
 * 
 * @param {Object} props
 * @param {string} props.activeStrip - 'recent' | 'saved'
 * @param {Function} props.setActiveStrip - Toggle strip type
 * @param {Array} props.recentChannels - Array of recent channel objects
 * @param {Array} props.savedChannels - Array of saved channel objects
 * @param {Function} props.onPickChannel - Callback when channel is selected
 */
const ChannelStrip = ({ activeStrip, setActiveStrip, recentChannels, savedChannels, onPickChannel }) => {
  const currentChannels = activeStrip === 'saved' ? savedChannels : recentChannels;
  const title = activeStrip === 'saved' ? 'Saved channels' : 'Recently searched';

  const handleNewChannel = () => {
    onPickChannel('');
  };

  const sectionStyle = {
    marginTop: '22px',
  };

  const labelStyle = {
    fontSize: '12.5px',
    color: 'var(--text-faint)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const switcherStyle = {
    display: 'flex',
    gap: '2px',
    background: 'var(--surface)',
    borderRadius: '100px',
    padding: '3px',
  };

  const stripStyle = {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    padding: '2px 2px 14px',
  };

  const buttonBaseStyle = {
    border: 'none',
    fontSize: '11.5px',
    padding: '5px 11px',
    borderRadius: '100px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const getButtonStyle = (isActive) => ({
    ...buttonBaseStyle,
    background: isActive ? 'var(--surface-hi)' : 'none',
    color: isActive ? 'var(--text)' : 'var(--text-faint)',
  });

  const addChanStyle = {
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

  const addRingStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--hairline)',
  };

  const addAvatarStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'none',
    border: '1.5px dashed var(--hairline)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '400',
    color: 'var(--text-faint)',
  };

  const addNameStyle = {
    fontSize: '11.5px',
    color: 'var(--text-dim)',
  };

  return (
    <section style={sectionStyle} className="strip-section">
      <div style={labelStyle} className="strip-label">
        <span>{title}</span>
        <div style={switcherStyle} className="switcher">
          <button
            style={getButtonStyle(activeStrip === 'recent')}
            onClick={() => setActiveStrip('recent')}
          >
            Recent
          </button>
          <button
            style={getButtonStyle(activeStrip === 'saved')}
            onClick={() => setActiveStrip('saved')}
          >
            Saved
          </button>
        </div>
      </div>
      
      <div style={stripStyle} className="strip scrollbar-hide">
        {currentChannels.map((channel, index) => (
          <ChannelPill
            key={`${channel.handle}-${index}`}
            channel={channel}
            type={activeStrip}
            onClick={() => onPickChannel(channel.handle)}
          />
        ))}
        
        {/* Add New Channel Button */}
        <button
          style={addChanStyle}
          className="chan add"
          onClick={handleNewChannel}
        >
          <div style={addRingStyle} className="ring">
            <div style={addAvatarStyle} className="avatar">
              +
            </div>
          </div>
          <div style={addNameStyle} className="name">New</div>
        </button>
      </div>
    </section>
  );
};

export default ChannelStrip;

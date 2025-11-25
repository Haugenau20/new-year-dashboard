import { useState, useEffect } from 'react';
import { useHomeAssistant } from './hooks/useHomeAssistant';
import { useSpotify } from './hooks/useSpotify';
import { NowPlaying } from './components/NowPlaying';
import { QueueDisplay } from './components/QueueDisplay';
import { SpotifyCallback } from './pages/SpotifyCallback';
import { SpotifyService } from './services/spotify';
import './App.css';

// Load configuration from environment variables
const HA_URL = import.meta.env.VITE_HA_URL || '';
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN || '';
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3001/callback';

function App() {
  const [spotifyService, setSpotifyService] = useState<SpotifyService | null>(null);
  const [isCallback, setIsCallback] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const dashboardState = useHomeAssistant(HA_URL, HA_TOKEN);
  const spotifyState = useSpotify(spotifyService);

  // Check if we're on the callback URL
  useEffect(() => {
    if (window.location.pathname === '/callback') {
      setIsCallback(true);
    }
  }, []);

  // Validate configuration on mount
  useEffect(() => {
    if (!HA_URL || !HA_TOKEN) {
      setConfigError('Missing Home Assistant configuration. Check your .env file.');
      return;
    }
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      setConfigError('Missing Spotify API configuration. Check your .env file.');
      return;
    }
    setConfigError(null);
  }, []);

  // Initialize Spotify service
  useEffect(() => {
    if (SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET && SPOTIFY_REDIRECT_URI) {
      const service = new SpotifyService({
        clientId: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
        redirectUri: SPOTIFY_REDIRECT_URI,
      });
      setSpotifyService(service);
    }
  }, []);

  // Handle Spotify OAuth callback
  const handleSpotifyCallback = async (code: string) => {
    if (spotifyService) {
      try {
        await spotifyService.handleCallback(code);
        window.location.href = '/';
      } catch (error) {
        console.error('Failed to complete Spotify authentication:', error);
      }
    }
  };

  const handleSpotifyCallbackError = (error: string) => {
    console.error('Spotify authentication error:', error);
    window.location.href = '/';
  };

  // Handle Spotify OAuth callback page
  if (isCallback) {
    return (
      <SpotifyCallback
        onSuccess={handleSpotifyCallback}
        onError={handleSpotifyCallbackError}
      />
    );
  }

  // Show configuration error if environment variables are missing
  if (configError) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h2>Configuration Error</h2>
          <p>{configError}</p>
          <div style={{ textAlign: 'left', marginTop: '2rem', maxWidth: '500px' }}>
            <p>To fix this:</p>
            <ol style={{ lineHeight: '1.8' }}>
              <li>Copy <code>.env.example</code> to <code>.env</code></li>
              <li>Fill in your credentials in the <code>.env</code> file</li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard
  if (!dashboardState.connected) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          {dashboardState.error ? (
            <>
              <h2>Connection Error</h2>
              <p>{dashboardState.error}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Check your .env file and restart the dev server
              </p>
            </>
          ) : (
            <>
              <h2>Connecting to Home Assistant...</h2>
              <p>{HA_URL}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const { mainPlayer, speakers, playlistSelector } = dashboardState;

  return (
    <div className="dashboard">
      <div className="main-content">
        {/* Currently Playing - Large Album Art Section */}
        <div className="now-playing">
          {mainPlayer?.state === 'playing' || mainPlayer?.state === 'paused' ? (
            <NowPlaying player={mainPlayer} haUrl={HA_URL} />
          ) : (
            <div className="no-playback">
              <div className="no-playback-icon">♪</div>
              <h2>No music playing</h2>
              <p>Start playing music to see it here</p>
            </div>
          )}
        </div>

        {/* Sidebar - Playlist and Speaker Status */}
        <div className="sidebar">
          {/* Spotify Queue and Playlist */}
          {spotifyState.isAuthenticated ? (
            <QueueDisplay queue={spotifyState.queue} playlist={spotifyState.playlist} />
          ) : (
            <div className="info-card">
              <h3>Spotify Queue</h3>
              <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Connect to Spotify to see the queue
              </p>
              <button
                onClick={() => spotifyService?.startAuthFlow()}
                className="connect-button"
                style={{ fontSize: '0.9rem', padding: '0.75rem' }}
              >
                Connect Spotify
              </button>
            </div>
          )}

          {/* Active Speakers */}
          <div className="info-card">
            <h3>Active Speakers</h3>
            <div className="speakers-list">
              <div
                className={`speaker-item ${speakers.kontor?.state === 'playing' ? 'active' : ''}`}
              >
                <span className="speaker-name">Kontor (Office)</span>
                <span className="speaker-status">
                  {speakers.kontor?.state === 'playing' ? '🔊' : '🔇'}
                </span>
              </div>
              <div
                className={`speaker-item ${speakers.stue?.state === 'playing' ? 'active' : ''}`}
              >
                <span className="speaker-name">Stue (Living Room)</span>
                <span className="speaker-status">
                  {speakers.stue?.state === 'playing' ? '🔊' : '🔇'}
                </span>
              </div>
            </div>
          </div>

          {/* Volume */}
          {mainPlayer && (
            <div className="info-card">
              <h3>Volume</h3>
              <div className="volume-display">
                <div className="volume-bar">
                  <div
                    className="volume-fill"
                    style={{
                      width: `${(mainPlayer.attributes.volume_level || 0) * 100}%`,
                    }}
                  />
                </div>
                <span className="volume-text">
                  {Math.round((mainPlayer.attributes.volume_level || 0) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connection Status Indicator */}
      <div className="connection-status">
        <span className="status-dot connected"></span>
        Connected
      </div>
    </div>
  );
}

export default App;

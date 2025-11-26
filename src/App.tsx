import { useState, useEffect } from 'react';
import { useHomeAssistant } from './hooks/useHomeAssistant';
import { useSpotify } from './hooks/useSpotify';
import { NowPlaying } from './components/NowPlaying';
import { QueueDisplay } from './components/QueueDisplay';
import { SpotifyCallback } from './pages/SpotifyCallback';
import { SpotifyService } from './services/spotify';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark p-8">
        <div className="bg-white/5 backdrop-blur-xs rounded-[20px] p-12 max-w-[500px] w-full border border-white/10">
          <h2 className="text-3xl text-white mb-2">Configuration Error</h2>
          <p className="text-white/60 mb-8">{configError}</p>
          <div className="text-left">
            <p className="text-white/80 mb-2">To fix this:</p>
            <ol className="text-white/70 leading-[1.8] list-decimal list-inside space-y-2">
              <li>Copy <code className="bg-white/10 px-2 py-1 rounded">.env.example</code> to <code className="bg-white/10 px-2 py-1 rounded">.env</code></li>
              <li>Fill in your credentials in the <code className="bg-white/10 px-2 py-1 rounded">.env</code> file</li>
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark">
        <div className="text-center">
          <div className="w-[60px] h-[60px] border-4 border-white/10 border-t-purple-primary rounded-full animate-spin mx-auto mb-8" />
          {dashboardState.error ? (
            <>
              <h2 className="text-white mb-2">Connection Error</h2>
              <p className="text-white/60">{dashboardState.error}</p>
              <p className="mt-4 text-sm text-white/60">
                Check your .env file and restart the dev server
              </p>
            </>
          ) : (
            <>
              <h2 className="text-white mb-2">Connecting to Home Assistant...</h2>
              <p className="text-white/60">{HA_URL}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const { mainPlayer } = dashboardState;

  return (
    <div className="w-screen h-screen bg-gradient-dark overflow-hidden relative">
      <div className="grid grid-cols-[1fr_400px] h-full gap-8 p-8 xl-dashboard:grid-cols-[1fr_350px] lg-dashboard:grid-cols-1 lg-dashboard:grid-rows-[1fr_auto]">
        {/* Currently Playing - Large Album Art Section */}
        <div className="flex flex-col items-center justify-center gap-8 bg-white/[0.02] rounded-[20px] p-12 border border-white/5">
          {mainPlayer?.state === 'playing' || mainPlayer?.state === 'paused' ? (
            <NowPlaying player={mainPlayer} haUrl={HA_URL} />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/40">
              <div className="text-[8rem] mb-4">♪</div>
              <h2 className="text-4xl mb-2">No music playing</h2>
              <p className="text-xl">Start playing music to see it here</p>
            </div>
          )}
        </div>

        {/* Sidebar - Playlist and Speaker Status */}
        <div className="flex flex-col gap-8 py-8 lg-dashboard:flex-row lg-dashboard:overflow-x-auto">
          {/* Spotify Queue and Playlist */}
          {spotifyState.isAuthenticated ? (
            <QueueDisplay queue={spotifyState.queue} playlist={spotifyState.playlist} />
          ) : (
            <div className="bg-white/5 backdrop-blur-xs rounded-[15px] p-8 border border-white/10 lg-dashboard:min-w-[250px]">
              <h3 className="text-xl text-white/70 mb-4 uppercase tracking-wide font-semibold">
                Spotify Queue
              </h3>
              <p className="mb-4 text-white/70">
                Connect to Spotify to see the queue
              </p>
              <button
                onClick={() => spotifyService?.startAuthFlow()}
                className="px-4 py-3 rounded-lg bg-gradient-purple text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
              >
                Connect Spotify
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;

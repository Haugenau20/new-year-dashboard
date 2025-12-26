import { useState, useEffect } from 'react';
import { useSpotify } from './hooks/useSpotify';
import { useNFCQueue } from './hooks/useNFCQueue';
import { useBackgroundRotation } from './hooks/useBackgroundRotation';
import { NowPlaying } from './components/NowPlaying';
import { QueueDisplay } from './components/QueueDisplay';
import { AnimatedBackground } from './components/AnimatedBackground';
import { MidnightCountdown } from './components/MidnightCountdown';
import { KongensTaleCountdown } from './components/KongensTaleCountdown';
import { SpotifyCallback } from './pages/SpotifyCallback';
import { BackgroundRecorder } from './pages/BackgroundRecorder';
import { BorderRecorder } from './pages/BorderRecorder';
import { SpotifyService } from './services/spotify';
import { HomeAssistantService } from './services/homeAssistant';
import { TRANSITION_DURATION_MS } from './config/backgrounds';

// Load configuration from environment variables
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3001/callback';
const FIREBASE_FUNCTIONS_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || '';
const HA_URL = import.meta.env.VITE_HA_URL || '';
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN || '';

function App() {
  const [spotifyService, setSpotifyService] = useState<SpotifyService | null>(null);
  const [haService, setHaService] = useState<HomeAssistantService | null>(null);
  const [isCallback, setIsCallback] = useState(false);
  const [isDevPage, setIsDevPage] = useState(false);
  const [isBorderRecordPage, setIsBorderRecordPage] = useState(false);
  const [isSecondaryPage, setIsSecondaryPage] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const spotifyState = useSpotify(spotifyService);
  const background = useBackgroundRotation(spotifyState.playback?.item?.uri);

  // Only use NFC queue on main page (not secondary)
  const nfcQueue = useNFCQueue(haService, spotifyState.pollInterval, !isSecondaryPage);

  // Check if we're on special routes
  useEffect(() => {
    const pathname = window.location.pathname;

    if (pathname === '/callback') {
      setIsCallback(true);
    } else if (pathname === '/dev') {
      setIsDevPage(true);
    } else if (pathname === '/border-record') {
      setIsBorderRecordPage(true);
    } else if (pathname === '/secondary') {
      setIsSecondaryPage(true);
    }
  }, []);

  // Validate configuration on mount
  useEffect(() => {
    if (!SPOTIFY_CLIENT_ID) {
      setConfigError('Missing Spotify API configuration. Check your .env file.');
      return;
    }
    setConfigError(null);
  }, []);

  // Initialize Spotify service
  useEffect(() => {
    if (SPOTIFY_CLIENT_ID && SPOTIFY_REDIRECT_URI) {
      const service = new SpotifyService({
        clientId: SPOTIFY_CLIENT_ID,
        redirectUri: SPOTIFY_REDIRECT_URI,
        functionsUrl: FIREBASE_FUNCTIONS_URL,
      });
      setSpotifyService(service);
    }
  }, []);

  // Initialize Home Assistant service (optional)
  useEffect(() => {
    if (HA_URL && HA_TOKEN) {
      const service = new HomeAssistantService({
        url: HA_URL,
        token: HA_TOKEN,
      });
      setHaService(service);
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

  // Handle special pages
  if (isCallback) {
    return (
      <SpotifyCallback
        onSuccess={handleSpotifyCallback}
        onError={handleSpotifyCallbackError}
      />
    );
  }

  if (isDevPage) {
    return <BackgroundRecorder />;
  }

  if (isBorderRecordPage) {
    return <BorderRecorder />;
  }

  // Show configuration error if environment variables are missing
  if (configError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark p-8 sm-dashboard:p-4">
        <div className="bg-white/5 backdrop-blur-xs rounded-[20px] sm-dashboard:rounded-[15px] p-12 sm-dashboard:p-6 max-w-[500px] w-full border border-white/10">
          <h2 className="text-3xl sm-dashboard:text-2xl text-white mb-2">Configuration Error</h2>
          <p className="text-white/60 mb-8 sm-dashboard:mb-4 sm-dashboard:text-sm">{configError}</p>
          <div className="text-left">
            <p className="text-white/80 mb-2 sm-dashboard:text-sm">To fix this:</p>
            <ol className="text-white/70 leading-[1.8] sm-dashboard:leading-[1.6] sm-dashboard:text-sm list-decimal list-inside space-y-2 sm-dashboard:space-y-1">
              <li>Copy <code className="bg-white/10 px-2 py-1 rounded sm-dashboard:text-xs">.env.example</code> to <code className="bg-white/10 px-2 py-1 rounded sm-dashboard:text-xs">.env</code></li>
              <li>Fill in your credentials in the <code className="bg-white/10 px-2 py-1 rounded sm-dashboard:text-xs">.env</code> file</li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while Spotify is initializing
  if (spotifyState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark">
        <div className="text-center">
          <div className="w-[60px] h-[60px] sm-dashboard:w-[45px] sm-dashboard:h-[45px] border-4 sm-dashboard:border-3 border-white/10 border-t-purple-primary rounded-full animate-spin mx-auto mb-8 sm-dashboard:mb-4" />
          <h2 className="text-white mb-2 sm-dashboard:text-lg">Loading Spotify...</h2>
        </div>
      </div>
    );
  }

  const handleConnectSpotify = () => {
    if (spotifyService) {
      spotifyService.startAuthFlow();
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-dark overflow-hidden relative">
      {/* Current background - fades out during transition */}
      <div
        key={`bg-${background.current.index}`}
        className="fixed inset-0 transition-opacity ease-in-out"
        style={{
          opacity: background.isTransitioning ? 0 : 0.6,
          transitionDuration: `${TRANSITION_DURATION_MS}ms`,
          zIndex: 0
        }}
      >
        <AnimatedBackground preset={background.current.preset} props={background.current.props} />
      </div>

      {/* Next background - fades in during transition */}
      {background.next && (
        <div
          key={`bg-${background.next.index}`}
          className="fixed inset-0 transition-opacity ease-in-out"
          style={{
            opacity: background.isTransitioning ? 0.6 : 0,
            transitionDuration: `${TRANSITION_DURATION_MS}ms`,
            zIndex: 1
          }}
        >
          <AnimatedBackground preset={background.next.preset} props={background.next.props} />
        </div>
      )}

      <div className="relative h-full w-full z-10">
        {/* Main Content - Centered Album Art */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 sm-dashboard:p-4">
          {!spotifyState.isAuthenticated ? (
            <div className="flex flex-col items-center justify-center text-white/80">
              <div className="text-[8rem] sm-dashboard:text-[6rem] mb-8 sm-dashboard:mb-6">♪</div>
              <h2 className="text-4xl sm-dashboard:text-3xl mb-4 sm-dashboard:mb-3">Connect to Spotify</h2>
              <p className="text-xl sm-dashboard:text-lg text-white/60 mb-8 sm-dashboard:mb-6">Connect your Spotify account to see what you're listening to</p>
              <button
                onClick={handleConnectSpotify}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold px-8 py-4 sm-dashboard:px-6 sm-dashboard:py-3 rounded-full text-lg sm-dashboard:text-base transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Connect to Spotify
              </button>
            </div>
          ) : spotifyState.playback?.item ? (
            <NowPlaying spotifyPlayback={spotifyState.playback} />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/40">
              <div className="text-[8rem] sm-dashboard:text-[6rem] mb-4">♪</div>
              <h2 className="text-4xl sm-dashboard:text-3xl mb-2">No music playing</h2>
              <p className="text-xl sm-dashboard:text-lg">Start playing music to see it here</p>
            </div>
          )}
        </div>

        {/* Overlay Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Top Left - Special Songs */}
          <div className="absolute top-8 left-8 sm-dashboard:top-4 sm-dashboard:left-4 pointer-events-auto">
            {spotifyState.isAuthenticated && !isSecondaryPage && (
              <QueueDisplay queue={spotifyState.queue} nfcQueue={nfcQueue} />
            )}
          </div>

          {/* Top Right - Countdown Timers */}
          <div className="absolute top-8 right-8 sm-dashboard:top-4 sm-dashboard:right-4 pointer-events-auto flex flex-col gap-4 sm-dashboard:gap-3">
            <MidnightCountdown />
            <KongensTaleCountdown />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

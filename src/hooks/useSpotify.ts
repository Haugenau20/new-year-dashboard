import { useState, useEffect } from 'react';
import { SpotifyService } from '../services/spotify';
import { SpotifyPlaybackState, SpotifyQueue } from '../types/spotify';

interface SpotifyState {
  playback: SpotifyPlaybackState | null;
  queue: SpotifyQueue | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pollInterval: number; // Current polling interval in ms
}

const POLL_INTERVAL_NORMAL = 3000; // Poll every 3 seconds
const POLL_INTERVAL_AFTER_FIRST_RATE_LIMIT = 5000; // Poll every 5 seconds after first rate limit
const POLL_INTERVAL_AFTER_SECOND_RATE_LIMIT = 10000; // Poll every 10 seconds after second rate limit

/**
 * Compare Spotify playback states to detect actual changes
 */
function isSpotifyStateEqual(
  prev: SpotifyPlaybackState | null,
  next: SpotifyPlaybackState | null
): boolean {
  if (prev === next) return true;
  if (!prev || !next) return prev === next;

  // Only compare meaningful state - NOT progress_ms (that changes every poll)
  return (
    prev.is_playing === next.is_playing &&
    prev.item?.uri === next.item?.uri &&
    prev.context?.uri === next.context?.uri
  );
}

/**
 * Compare Spotify queues to detect actual changes
 */
function isQueueEqual(prev: SpotifyQueue | null, next: SpotifyQueue | null): boolean {
  if (prev === next) return true;
  if (!prev || !next) return prev === next;

  if (prev.queue.length !== next.queue.length) return false;

  // Compare first 5 tracks (most relevant for queue display)
  const compareCount = Math.min(5, prev.queue.length);
  for (let i = 0; i < compareCount; i++) {
    if (prev.queue[i]?.uri !== next.queue[i]?.uri) return false;
  }

  return true;
}

export function useSpotify(spotifyService: SpotifyService | null) {
  const [state, setState] = useState<SpotifyState>({
    playback: null,
    queue: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    pollInterval: POLL_INTERVAL_NORMAL,
  });

  useEffect(() => {
    if (!spotifyService) {
      setState((prev) => ({ ...prev, isLoading: false, isAuthenticated: false }));
      return;
    }

    const isAuth = spotifyService.isAuthenticated();
    setState((prev) => ({ ...prev, isAuthenticated: isAuth }));

    if (!isAuth) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    let isMounted = true;
    let currentInterval: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      // Skip fetch if we're currently rate limited
      if (spotifyService.isRateLimited()) {
        if (process.env.NODE_ENV === 'development') {
          console.log('⏸️  Skipping fetch - rate limited');
        }
        return;
      }

      try {
        const [playback, queue] = await Promise.all([
          spotifyService.getCurrentPlayback(),
          spotifyService.getQueue(),
        ]);

        if (!isMounted) return;

        // Only update state if data actually changed
        setState((prev) => {
          const playbackChanged = !isSpotifyStateEqual(prev.playback, playback);
          const queueChanged = !isQueueEqual(prev.queue, queue);

          // If nothing changed, return previous state (prevents re-render)
          if (!playbackChanged && !queueChanged) {
            return prev;
          }

          // Log only when something actually changed
          if (process.env.NODE_ENV === 'development') {
            if (playbackChanged) {
              console.log('🎵 Track changed:', playback?.item?.name);
            }
            if (queueChanged) {
              console.log('📋 Queue updated:', queue?.queue.length, 'tracks');
            }
          }

          return {
            ...prev,
            playback,
            queue,
            isLoading: false,
            error: null,
          };
        });
      } catch (error) {
        if (!isMounted) return;

        // Log rate limit errors in development
        if (process.env.NODE_ENV === 'development' && error instanceof Error) {
          if (error.message.includes('Rate limited')) {
            console.warn('⚠️ ', error.message);
          }
        }

        // Silently handle errors
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      }
    };

    const setupPolling = () => {
      // Determine polling interval based on rate limit history
      const rateLimitCount = spotifyService.getRateLimitCount();
      let pollInterval = POLL_INTERVAL_NORMAL;

      if (rateLimitCount >= 2) {
        pollInterval = POLL_INTERVAL_AFTER_SECOND_RATE_LIMIT;
      } else if (rateLimitCount === 1) {
        pollInterval = POLL_INTERVAL_AFTER_FIRST_RATE_LIMIT;
      }

      // Update state with current poll interval
      setState((prev) => ({ ...prev, pollInterval }));

      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Polling interval: ${pollInterval}ms (rate limits: ${rateLimitCount})`);
      }

      // Initial fetch
      fetchData();

      // Poll for updates
      currentInterval = setInterval(fetchData, pollInterval);
    };

    setupPolling();

    return () => {
      isMounted = false;
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  }, [spotifyService]);

  return state;
}

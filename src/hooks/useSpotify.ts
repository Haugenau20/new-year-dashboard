import { useState, useEffect } from 'react';
import { SpotifyService } from '../services/spotify';
import { SpotifyPlaybackState, SpotifyQueue } from '../types/spotify';

interface SpotifyState {
  playback: SpotifyPlaybackState | null;
  queue: SpotifyQueue | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const POLL_INTERVAL = 3000; // Poll every 3 seconds

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

    const fetchData = async () => {
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
        // Silently handle errors
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      }
    };

    // Initial fetch
    fetchData();

    // Poll for updates
    const interval = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [spotifyService]);

  return state;
}

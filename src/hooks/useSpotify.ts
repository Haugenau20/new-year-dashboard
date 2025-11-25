import { useState, useEffect } from 'react';
import { SpotifyService } from '../services/spotify';
import { SpotifyPlaybackState, SpotifyQueue, SpotifyPlaylist } from '../types/spotify';

interface SpotifyState {
  playback: SpotifyPlaybackState | null;
  queue: SpotifyQueue | null;
  playlist: SpotifyPlaylist | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const POLL_INTERVAL = 3000; // Poll every 3 seconds

export function useSpotify(spotifyService: SpotifyService | null) {
  const [state, setState] = useState<SpotifyState>({
    playback: null,
    queue: null,
    playlist: null,
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

        // Extract playlist ID from context if available
        let playlist: SpotifyPlaylist | null = null;
        if (playback?.context?.type === 'playlist') {
          const playlistId = playback.context.uri.split(':').pop();
          if (playlistId) {
            playlist = await spotifyService.getPlaylist(playlistId);
          }
        }

        setState((prev) => ({
          ...prev,
          playback,
          queue,
          playlist,
          isLoading: false,
          error: null,
        }));

        console.log('Spotify data updated:', {
          isPlaying: playback?.is_playing,
          track: playback?.item?.name,
          queueLength: queue?.queue.length,
          playlist: playlist?.name,
        });
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching Spotify data:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch Spotify data',
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

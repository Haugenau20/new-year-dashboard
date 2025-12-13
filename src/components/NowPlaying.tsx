import { useState, useEffect, memo } from 'react';
import { SpotifyPlaybackState } from '../types/spotify';

interface NowPlayingProps {
  spotifyPlayback: SpotifyPlaybackState | null;
}

// Custom comparison function to prevent re-renders on position-only updates
function arePropsEqual(prev: NowPlayingProps, next: NowPlayingProps): boolean {
  // Don't re-render if only position changed (handled by internal state)
  const prevTrack = prev.spotifyPlayback?.item;
  const nextTrack = next.spotifyPlayback?.item;

  return (
    prev.spotifyPlayback?.is_playing === next.spotifyPlayback?.is_playing &&
    prevTrack?.uri === nextTrack?.uri &&
    prevTrack?.name === nextTrack?.name &&
    prevTrack?.artists[0]?.name === nextTrack?.artists[0]?.name &&
    prevTrack?.album.name === nextTrack?.album.name &&
    prevTrack?.album.images[0]?.url === nextTrack?.album.images[0]?.url &&
    prevTrack?.duration_ms === nextTrack?.duration_ms
  );
}

export const NowPlaying = memo(function NowPlaying({ spotifyPlayback }: NowPlayingProps) {
  // Convert ms to seconds for easier handling
  const initialPosition = spotifyPlayback?.progress_ms
    ? Math.floor(spotifyPlayback.progress_ms / 1000)
    : 0;

  const [_currentPosition, setCurrentPosition] = useState(initialPosition);

  // Update position every second when playing
  useEffect(() => {
    if (!spotifyPlayback?.is_playing) {
      setCurrentPosition(initialPosition);
      return;
    }

    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        const newPos = prev + 1;
        const duration = spotifyPlayback.item?.duration_ms
          ? Math.floor(spotifyPlayback.item.duration_ms / 1000)
          : 0;
        return newPos <= duration ? newPos : duration;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [spotifyPlayback?.is_playing, initialPosition, spotifyPlayback?.item?.duration_ms]);

  // Sync with actual position when it changes
  useEffect(() => {
    setCurrentPosition(initialPosition);
  }, [initialPosition]);

  // const duration = spotifyPlayback?.item?.duration_ms
  //   ? Math.floor(spotifyPlayback.item.duration_ms / 1000)
  //   : 0;
  // const progressPercent = duration > 0 ? (currentPosition / duration) * 100 : 0;

  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = Math.floor(seconds % 60);
  //   return `${mins}:${secs.toString().padStart(2, '0')}`;
  // };

  // Get data from Spotify playback
  const track = spotifyPlayback?.item;
  const imageUrl = track?.album.images[0]?.url || null;
  const title = track?.name || 'Unknown Track';
  const artist = track?.artists[0]?.name || 'Unknown Artist';
  // const albumName = track?.album.name || '';
  // const isPlaying = spotifyPlayback?.is_playing || false;

  return (
    <>
      <div className="w-full max-w-[700px] xl-dashboard:max-w-[600px] sm-dashboard:max-w-[200px] aspect-square rounded-[20px] sm-dashboard:rounded-[15px] overflow-hidden shadow-album">
        {imageUrl ? (
          <img src={imageUrl} alt="Album Art" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-purple flex items-center justify-center text-[8rem] sm-dashboard:text-[6rem] text-white/30">
            <span>♪</span>
          </div>
        )}
      </div>

      <div className="text-center w-full max-w-[700px] xl-dashboard:max-w-[600px] sm-dashboard:max-w-[450px] mt-8 sm-dashboard:mt-6">
        <h1 className="text-5xl font-bold mb-2 text-white leading-tight xl-dashboard:text-[2.5rem] sm-dashboard:text-[1.5rem] sm-dashboard:mb-1 line-clamp-2">
          {title}
        </h1>
        <h2 className="text-3xl font-medium mb-2 text-white/80 xl-dashboard:text-2xl sm-dashboard:text-xl sm-dashboard:mb-1 line-clamp-1">
          {artist}
        </h2>
        {/* <p className="text-2xl text-white/60 mb-8 xl-dashboard:text-xl sm-dashboard:text-lg sm-dashboard:mb-4 line-clamp-1">
          {albumName}
        </p> */}

        {/* Playback Progress */}
        {/* {duration > 0 && (
          <>
            <div className="w-full h-2 bg-white/10 rounded overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-purple-90 transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-base text-white/60 mb-6">
              <span>{formatTime(currentPosition)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </>
        )} */}

        {/* Playback Status */}
        {/* <div className="text-xl text-white/70 font-semibold">
          {isPlaying ? '▶ Playing' : '⏸ Paused'}
        </div> */}
      </div>
    </>
  );
}, arePropsEqual);

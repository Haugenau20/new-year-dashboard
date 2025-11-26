import { useState, useEffect } from 'react';
import { MediaPlayerEntity } from '../types/homeAssistant';

interface NowPlayingProps {
  player: MediaPlayerEntity;
  haUrl: string;
}

export function NowPlaying({ player, haUrl }: NowPlayingProps) {
  const [currentPosition, setCurrentPosition] = useState(
    player.attributes.media_position || 0
  );

  // Update position every second when playing
  useEffect(() => {
    if (player.state !== 'playing') {
      setCurrentPosition(player.attributes.media_position || 0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        const newPos = prev + 1;
        const duration = player.attributes.media_duration || 0;
        return newPos <= duration ? newPos : duration;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [player.state, player.attributes.media_position, player.attributes.media_duration]);

  // Sync with actual position when it changes
  useEffect(() => {
    setCurrentPosition(player.attributes.media_position || 0);
  }, [player.attributes.media_position]);

  const duration = player.attributes.media_duration || 0;
  const progressPercent = duration > 0 ? (currentPosition / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert ws:// or http:// to http:// for image URLs
  const imageUrl = player.attributes.entity_picture
    ? `${haUrl.replace('ws://', 'http://').replace('wss://', 'https://')}${player.attributes.entity_picture}`
    : null;

  return (
    <>
      <div className="w-full max-w-[600px] aspect-square rounded-[20px] overflow-hidden shadow-album">
        {imageUrl ? (
          <img src={imageUrl} alt="Album Art" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-purple flex items-center justify-center text-[8rem] text-white/30">
            <span>♪</span>
          </div>
        )}
      </div>

      <div className="text-center w-full max-w-[600px]">
        <h1 className="text-5xl font-bold mb-2 text-white leading-tight xl-dashboard:text-[2.5rem]">
          {player.attributes.media_title || 'Unknown Track'}
        </h1>
        <h2 className="text-3xl font-medium mb-2 text-white/80 xl-dashboard:text-2xl">
          {player.attributes.media_artist || 'Unknown Artist'}
        </h2>
        <p className="text-2xl text-white/60 mb-8 xl-dashboard:text-xl">
          {player.attributes.media_album_name || ''}
        </p>

        {/* Playback Progress */}
        {duration > 0 && (
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
        )}

        {/* Playback Status */}
        <div className="text-xl text-white/70 font-semibold">
          {player.state === 'playing' ? '▶ Playing' : '⏸ Paused'}
        </div>
      </div>
    </>
  );
}

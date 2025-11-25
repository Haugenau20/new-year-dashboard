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
      <div className="album-art-container">
        {imageUrl ? (
          <img src={imageUrl} alt="Album Art" className="album-art" />
        ) : (
          <div className="album-art-placeholder">
            <span>♪</span>
          </div>
        )}
      </div>

      <div className="track-info">
        <h1 className="track-title">
          {player.attributes.media_title || 'Unknown Track'}
        </h1>
        <h2 className="track-artist">
          {player.attributes.media_artist || 'Unknown Artist'}
        </h2>
        <p className="track-album">{player.attributes.media_album_name || ''}</p>

        {/* Playback Progress */}
        {duration > 0 && (
          <>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
            <div className="progress-time">
              <span>{formatTime(currentPosition)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </>
        )}

        {/* Playback Status */}
        <div className="playback-status">
          {player.state === 'playing' ? '▶ Playing' : '⏸ Paused'}
        </div>
      </div>
    </>
  );
}

import { SpotifyQueue, SpotifyPlaylist, SpotifyTrack } from '../types/spotify';
import { SPECIAL_SONGS } from '../config/specialSongs';
import { ElectricBorder } from './ElectricBorder';

interface QueueDisplayProps {
  queue: SpotifyQueue | null;
  playlist: SpotifyPlaylist | null;
}

function isSpecialSong(track: SpotifyTrack): { isSpecial: boolean; label?: string } {
  for (const special of SPECIAL_SONGS) {
    // Check by URI (most accurate)
    if (special.uri && track.uri === special.uri) {
      return { isSpecial: true, label: special.label };
    }

    // Check by track name and artist (case-insensitive)
    if (special.trackName && special.artistName) {
      const trackNameMatch = track.name.toLowerCase() === special.trackName.toLowerCase();
      const artistMatch = track.artists.some(
        (artist) => artist.name.toLowerCase() === special.artistName!.toLowerCase()
      );

      if (trackNameMatch && artistMatch) {
        return { isSpecial: true, label: special.label };
      }
    }
  }

  return { isSpecial: false };
}

export function QueueDisplay({ queue, playlist }: QueueDisplayProps) {
  const upcomingTracks = queue?.queue.slice(0, 5) || [];

  return (
    <div className="queue-section">
      {/* Playlist Info */}
      {playlist && (
        <div className="info-card playlist-card">
          <h3>Current Playlist</h3>
          <div className="playlist-info">
            {playlist.images[0] && (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                className="playlist-cover"
              />
            )}
            <div className="playlist-details">
              <p className="playlist-name">{playlist.name}</p>
              <p className="playlist-tracks">{playlist.tracks.total} tracks</p>
            </div>
          </div>
        </div>
      )}

      {/* Queue */}
      {upcomingTracks.length > 0 && (
        <div className="info-card queue-card">
          <h3>Up Next</h3>
          <div className="queue-list">
            {upcomingTracks.map((track, index) => {
              const { isSpecial, label } = isSpecialSong(track);

              const queueItemContent = (
                <div
                  className={`queue-item ${isSpecial ? 'special-song' : ''}`}
                  title={isSpecial ? label || 'Special Song' : undefined}
                >
                  <span className="queue-number">{index + 1}</span>
                  {isSpecial && <span className="special-badge">⭐</span>}
                  {track.album.images[2] && (
                    <img
                      src={track.album.images[2].url}
                      alt={track.name}
                      className="queue-thumbnail"
                    />
                  )}
                  <div className="queue-track-info">
                    <p className="queue-track-name">{track.name}</p>
                    <p className="queue-track-artist">
                      {track.artists.map((a) => a.name).join(', ')}
                    </p>
                    {isSpecial && label && (
                      <p className="special-label">{label}</p>
                    )}
                  </div>
                </div>
              );

              return isSpecial ? (
                <ElectricBorder
                  key={`${track.id}-${index}`}
                  color="#FFD700"
                  speed={1.5}
                  chaos={0.8}
                  thickness={3}
                  style={{ borderRadius: 8 }}
                >
                  {queueItemContent}
                </ElectricBorder>
              ) : (
                <div key={`${track.id}-${index}`}>{queueItemContent}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

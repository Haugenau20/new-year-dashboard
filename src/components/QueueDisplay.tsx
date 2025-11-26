import { SpotifyQueue, SpotifyPlaylist, SpotifyTrack } from '../types/spotify';
import { SPECIAL_SONGS } from '../config/specialSongs';
import ElectricBorder from './ElectricBorder';
import { cn } from '@/lib/utils';

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
    <div className="flex flex-col gap-8">
      {/* Playlist Info */}
      {playlist && (
        <div className="bg-white/5 backdrop-blur-xs rounded-[15px] p-8 border border-white/10">
          <h3 className="text-xl text-white/70 mb-4 uppercase tracking-wide font-semibold">
            Current Playlist
          </h3>
          <div className="flex items-center gap-4">
            {playlist.images[0] && (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-2xl text-white font-semibold">{playlist.name}</p>
              <p className="text-base text-white/60">{playlist.tracks.total} tracks</p>
            </div>
          </div>
        </div>
      )}

      {/* Queue */}
      {upcomingTracks.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xs rounded-[15px] p-8 border border-white/10">
          <h3 className="text-xl text-white/70 mb-4 uppercase tracking-wide font-semibold">
            Up Next
          </h3>
          <div className="flex flex-col gap-6 overflow-visible">
            {upcomingTracks.map((track, index) => {
              const { isSpecial, label } = isSpecialSong(track);

              const queueItemContent = (
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg transition-colors duration-200 relative",
                    "hover:bg-white/5",
                    isSpecial && "bg-gradient-gold shadow-gold hover:bg-gradient-gold-hover hover:shadow-gold-hover"
                  )}
                  title={isSpecial ? label || 'Special Song' : undefined}
                >
                  <span className="text-base text-white/50 font-semibold min-w-[20px]">
                    {index + 1}
                  </span>
                  {isSpecial && (
                    <span className="absolute top-2 right-2 text-xl animate-sparkle">⭐</span>
                  )}
                  {track.album.images[2] && (
                    <img
                      src={track.album.images[2].url}
                      alt={track.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.95rem] text-white/90 whitespace-nowrap overflow-hidden text-ellipsis">
                      {track.name}
                    </p>
                    <p className="text-[0.85rem] text-white/60 whitespace-nowrap overflow-hidden text-ellipsis">
                      {track.artists.map((a) => a.name).join(', ')}
                    </p>
                    {isSpecial && label && (
                      <p className="text-xs text-gold-light font-semibold uppercase tracking-wider mt-1">
                        {label}
                      </p>
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

import { memo } from 'react';
import { SpotifyQueue, SpotifyTrack } from '../types/spotify';
import { SPECIAL_SONGS } from '../config/specialSongs';
import DiscoBorder from './DiscoBorder';

interface QueueDisplayProps {
  queue: SpotifyQueue | null;
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

export const QueueDisplay = memo(function QueueDisplay({ queue }: QueueDisplayProps) {
  const upcomingTracks = queue?.queue.slice(0, 5) || [];

  // Filter to get only special songs from queue
  const specialSongs = upcomingTracks.filter(track => isSpecialSong(track).isSpecial);

  // Get the first special song and any additional ones
  const nextSpecialSong = specialSongs[0];
  const additionalSpecialSongs = specialSongs.slice(1);

  // If no special songs, don't render
  if (!nextSpecialSong) {
    return null;
  }

  const { label } = isSpecialSong(nextSpecialSong);

  return (
    <div className="w-[320px] sm-dashboard:w-[280px]">
      <div className="rounded-[15px] sm-dashboard:rounded-[12px] p-5 sm-dashboard:p-4">
        <h3 className="text-base text-white/70 mb-4 sm-dashboard:text-sm sm-dashboard:mb-3 uppercase tracking-wide font-semibold">
          Up Next
        </h3>

        <div className="flex flex-col gap-3 sm-dashboard:gap-2">
          {/* Main/Next Special Song */}
          <DiscoBorder>
            <div className="flex items-center gap-4 sm-dashboard:gap-3 p-4 sm-dashboard:p-3 bg-gradient-gold shadow-gold rounded-lg relative">
              {nextSpecialSong.album?.images && nextSpecialSong.album.images.length > 0 && (
                <img
                  src={nextSpecialSong.album.images[nextSpecialSong.album.images.length > 2 ? 2 : 0].url}
                  alt={nextSpecialSong.name}
                  className="w-16 h-16 sm-dashboard:w-12 sm-dashboard:h-12 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-lg sm-dashboard:text-base text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  {nextSpecialSong.name}
                </p>
                <p className="text-base sm-dashboard:text-sm text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">
                  {nextSpecialSong.artists.map((a) => a.name).join(', ')}
                </p>
                {label && (
                  <p className="text-sm sm-dashboard:text-xs text-gold-light font-semibold uppercase tracking-wider mt-1">
                    {label}
                  </p>
                )}
              </div>
            </div>
          </DiscoBorder>

          {/* Additional Special Songs (1/2 size) */}
          {additionalSpecialSongs.map((track, index) => {
            const { label: trackLabel } = isSpecialSong(track);
            return (
              <div key={`${track.id}-${index}`} className="w-[240px] sm-dashboard:w-[200px]">
                <DiscoBorder>
                  <div className="flex items-center gap-2 sm-dashboard:gap-1.5 p-2 sm-dashboard:p-1.5 bg-gradient-gold shadow-gold rounded-md relative">
                    {track.album?.images && track.album.images.length > 0 && (
                      <img
                        src={track.album.images[track.album.images.length > 2 ? 2 : 0].url}
                        alt={track.name}
                        className="w-8 h-8 sm-dashboard:w-6 sm-dashboard:h-6 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm-dashboard:text-xs text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                        {track.name}
                      </p>
                      <p className="text-xs sm-dashboard:text-[0.65rem] text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">
                        {track.artists.map((a) => a.name).join(', ')}
                      </p>
                      {trackLabel && (
                        <p className="text-[0.65rem] sm-dashboard:text-[0.55rem] text-gold-light font-semibold uppercase tracking-wider mt-0.5">
                          {trackLabel}
                        </p>
                      )}
                    </div>
                  </div>
                </DiscoBorder>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

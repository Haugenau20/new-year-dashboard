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
    <div className="w-[220px] sm-dashboard:w-[190px]">
      <div className="rounded-[10px] sm-dashboard:rounded-[8px] p-3 sm-dashboard:p-2.5">
        <h3 className="text-sm text-white/70 mb-2.5 sm-dashboard:text-xs sm-dashboard:mb-2 uppercase tracking-wide font-semibold">
          Up Next
        </h3>

        <div className="flex flex-col gap-2 sm-dashboard:gap-1.5">
          {/* Main/Next Special Song */}
          <DiscoBorder>
            <div className="flex items-center gap-2.5 sm-dashboard:gap-2 p-2.5 sm-dashboard:p-2 bg-gradient-gold shadow-gold rounded-lg relative">
              {nextSpecialSong.album?.images && nextSpecialSong.album.images.length > 0 && (
                <img
                  src={nextSpecialSong.album.images[nextSpecialSong.album.images.length > 2 ? 2 : 0].url}
                  alt={nextSpecialSong.name}
                  className="w-11 h-11 sm-dashboard:w-8 sm-dashboard:h-8 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm sm-dashboard:text-xs text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  {nextSpecialSong.name}
                </p>
                <p className="text-xs sm-dashboard:text-[0.65rem] text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">
                  {nextSpecialSong.artists.map((a) => a.name).join(', ')}
                </p>
                {label && (
                  <p className="text-[0.65rem] sm-dashboard:text-[0.55rem] text-gold-light font-semibold uppercase tracking-wider mt-0.5">
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
              <div key={`${track.id}-${index}`} className="w-[160px] sm-dashboard:w-[135px]">
                <DiscoBorder>
                  <div className="flex items-center gap-1.5 sm-dashboard:gap-1 p-1.5 sm-dashboard:p-1 bg-gradient-gold shadow-gold rounded-md relative">
                    {track.album?.images && track.album.images.length > 0 && (
                      <img
                        src={track.album.images[track.album.images.length > 2 ? 2 : 0].url}
                        alt={track.name}
                        className="w-6 h-6 sm-dashboard:w-5 sm-dashboard:h-5 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.65rem] sm-dashboard:text-[0.55rem] text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                        {track.name}
                      </p>
                      <p className="text-[0.55rem] sm-dashboard:text-[0.5rem] text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">
                        {track.artists.map((a) => a.name).join(', ')}
                      </p>
                      {trackLabel && (
                        <p className="text-[0.5rem] sm-dashboard:text-[0.45rem] text-gold-light font-semibold uppercase tracking-wider mt-0.5">
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

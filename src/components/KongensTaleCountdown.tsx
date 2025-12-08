import { useMemo } from 'react';
import { useCurrentTime } from '../hooks/useCurrentTime';

export function KongensTaleCountdown() {
  const now = useCurrentTime();
  const kongensTale = useMemo(() => new Date('2025-12-31T18:00:00'), []);

  const diff = kongensTale.getTime() - now.getTime();

  // Don't render if countdown is over
  if (diff <= 0) {
    return null;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Format: "DD:HH:MM:SS" or just "HH:MM:SS" if less than 1 day
  const timeRemaining = days > 0
    ? `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="rounded-[12px] sm-dashboard:rounded-[10px] px-4 py-3 sm-dashboard:px-3 sm-dashboard:py-2">
      <div className="text-center">
        <p className="text-xs text-white/50 mb-1 sm-dashboard:text-[0.65rem] uppercase tracking-wider font-semibold">
          Kongens Tale
        </p>
        <p className="text-2xl sm-dashboard:text-xl text-white/50 font-mono font-bold tabular-nums">
          {timeRemaining}
        </p>
      </div>
    </div>
  );
}

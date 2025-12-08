import { useState, useEffect } from 'react';

/**
 * Shared hook that provides synchronized current time across all components.
 * Updates every second to keep countdowns in sync.
 */
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update immediately
    setCurrentTime(new Date());

    // Update every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

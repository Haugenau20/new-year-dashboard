import { useState, useEffect } from 'react';
import { HomeAssistantService } from '../services/homeAssistant';

export function useNFCQueue(
  haService: HomeAssistantService | null,
  pollInterval: number,
  enabled: boolean = true
) {
  const [nfcQueue, setNfcQueue] = useState<string[]>([]);

  useEffect(() => {
    if (!haService || !enabled) {
      setNfcQueue([]);
      return;
    }

    let isMounted = true;
    let currentInterval: NodeJS.Timeout | null = null;

    const fetchNFCQueue = async () => {
      try {
        const queue = await haService.getNFCQueueTracker();

        if (!isMounted) return;

        setNfcQueue(queue);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching NFC queue:', error);
        setNfcQueue([]);
      }
    };

    // Initial fetch
    fetchNFCQueue();

    // Poll for updates
    currentInterval = setInterval(fetchNFCQueue, pollInterval);

    return () => {
      isMounted = false;
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  }, [haService, pollInterval, enabled]);

  return nfcQueue;
}

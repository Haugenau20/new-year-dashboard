import { useState, useEffect, useMemo } from 'react';
import { BACKGROUNDS, ROTATION_INTERVAL_MS, TRANSITION_DURATION_MS, BackgroundPreset } from '../config/backgrounds';
import specialSongColors from '../config/specialSongColors.json';
import { rgbToFilters } from '../utils/colorFilters';

interface BackgroundState {
  current: {
    preset: BackgroundPreset;
    props: Record<string, any>;
    index: number;
  };
  next: {
    preset: BackgroundPreset;
    props: Record<string, any>;
    index: number;
  } | null;
  isTransitioning: boolean;
}

/**
 * Hook to manage background rotation
 * @param currentTrackUri - Spotify URI of the currently playing track (e.g., "spotify:track:...")
 * @returns Current background preset and props
 *
 * NOTE: Special song color filters are currently DISABLED (needs calibration work).
 *       See commented code in calculateProps() to re-enable.
 */
export function useBackgroundRotation(currentTrackUri?: string): BackgroundState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Rotate backgrounds on timer
  useEffect(() => {
    const interval = setInterval(() => {
      // Step 1: Set next background (renders at opacity 0)
      setNextIndex((currentIndex + 1) % BACKGROUNDS.length);

      // Step 2: After a brief delay, start transition (triggers fade)
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50); // Small delay to ensure next background renders first

      // Step 3: After transition duration, swap and reset
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % BACKGROUNDS.length);
        setNextIndex(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION_MS + 50); // Add 50ms to account for initial delay
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Helper function to calculate props for a given preset
  const calculateProps = useMemo(() => {
    return (preset: BackgroundPreset) => {
      // Start with default props
      let calculatedProps = { ...preset.defaultProps };

      // ============================================================================
      // SPECIAL SONG COLOR FILTERS - CURRENTLY DISABLED
      // ============================================================================
      // To re-enable: Uncomment the code below
      //
      // NOTE: Before enabling, you need to calibrate each background video:
      // 1. Add a `hueOffset` property to each background in backgrounds.ts
      // 2. For each background, determine its base color hue (0-360°)
      // 3. Calculate offset needed to shift it to match special song colors
      //
      // Estimated effort: ~30-60 minutes per background video × 5-8 backgrounds
      // ============================================================================

      // if (currentTrackUri && currentTrackUri in specialSongColors) {
      //   const songData = specialSongColors[currentTrackUri as keyof typeof specialSongColors];
      //   const colors = songData.colors;
      //
      //   // Apply CSS filters for special song color
      //   if (colors.vibrant) {
      //     const filters = rgbToFilters(colors.vibrant);
      //     calculatedProps.hueRotate = filters.hueRotate;
      //     calculatedProps.saturation = filters.saturation;
      //     calculatedProps.brightness = filters.brightness;
      //   }
      // }

      return calculatedProps;
    };
  }, [currentTrackUri]);

  // Get current background
  const currentPreset = BACKGROUNDS[currentIndex];
  const currentProps = useMemo(() => calculateProps(currentPreset), [calculateProps, currentPreset]);

  // Get next background if transitioning
  const nextPreset = nextIndex !== null ? BACKGROUNDS[nextIndex] : null;
  const nextProps = useMemo(() => nextPreset ? calculateProps(nextPreset) : null, [calculateProps, nextPreset]);

  // Preload next video for smooth transitions
  useEffect(() => {
    if (nextPreset && nextProps && 'src' in nextProps) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = nextProps.src as string;

      // Optional: Actually load the video
      video.load();

      // Cleanup
      return () => {
        video.src = '';
      };
    }
  }, [nextPreset, nextProps]);

  // Special song detection logging (disabled since color filters are disabled)
  // useEffect(() => {
  //   const isSpecial = currentTrackUri && currentTrackUri in specialSongColors;
  //
  //   if (process.env.NODE_ENV === 'development' && isSpecial) {
  //     console.log('⭐ Special song:', currentTrackUri);
  //   }
  // }, [currentTrackUri]);

  return {
    current: {
      preset: currentPreset,
      props: currentProps,
      index: currentIndex,
    },
    next: nextPreset && nextProps && nextIndex !== null ? {
      preset: nextPreset,
      props: nextProps,
      index: nextIndex,
    } : null,
    isTransitioning,
  };
}

// Note: Helper functions removed - color conversion now handled by utils/colorFilters.ts

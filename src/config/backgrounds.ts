import VideoBackground from '../components/VideoBackground';

export interface BackgroundPreset {
  name: string;
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
}

export const BACKGROUNDS: BackgroundPreset[] = [
  // {
  //   name: 'DarkVeil',
  //   component: VideoBackground,
  //   defaultProps: {
  //     src: '/assets/videos/darkveil-loop.mp4',
  //     hueRotate: 0,
  //     saturation: 100,
  //     brightness: 100,
  //     opacity: 0.6
  //   }
  // },
  // {
  //   name: 'ColorBends',
  //   component: VideoBackground,
  //   defaultProps: {
  //     src: '/assets/videos/colorbends-loop.mp4',
  //     hueRotate: 180,        // Purple/blue hues
  //     saturation: 150,       // Boost saturation for vibrant colors
  //     brightness: 100,       // Slightly brighter
  //     opacity: 0.8
  //   }
  // },
  {
    name: 'Iridescence',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/iridescence-loop.mp4',
      hueRotate: 0,
      saturation: 100,
      brightness: 100,
      opacity: 0.6
    }
  },
  // {
  //   name: 'Variant 1',
  //   component: VideoBackground,
  //   defaultProps: {
  //     src: '/assets/videos/variant-1.mp4',
  //     hueRotate: 0,
  //     saturation: 100,
  //     brightness: 100,
  //     opacity: 0.6
  //   }
  // },
  // {
  //   name: 'Variant 2',
  //   component: VideoBackground,
  //   defaultProps: {
  //     src: '/assets/videos/variant-2.mp4',
  //     hueRotate: 0,
  //     saturation: 100,
  //     brightness: 100,
  //     opacity: 0.6
  //   }
  // },
  // {
  //   name: 'Variant 3',
  //   component: VideoBackground,
  //   defaultProps: {
  //     src: '/assets/videos/variant-3.mp4',
  //     hueRotate: 0,
  //     saturation: 100,
  //     brightness: 100,
  //     opacity: 0.6
  //   }
  // },
];

// Configurable rotation interval (in milliseconds)
// 10000ms (10s) for development testing
// 120000ms (120s) or 180000ms (180s) recommended for production
export const ROTATION_INTERVAL_MS = 30000;

// Transition duration (20% of rotation interval for smooth crossfade)
export const TRANSITION_DURATION_MS = ROTATION_INTERVAL_MS / 5; // 6 seconds

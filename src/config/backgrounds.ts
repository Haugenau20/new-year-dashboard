import VideoBackground from '../components/VideoBackground';

export interface BackgroundPreset {
  name: string;
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
}

export const BACKGROUNDS: BackgroundPreset[] = [
  {
    name: 'DarkVeil',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/darkveil-loop.mp4',
      seamlessLoop: true,
      videoDuration: 75,
      crossfadeDuration: 5,
      hueRotate: 0,
      saturation: 100,
      brightness: 150,
      opacity: 1
    }
  },
  {
    name: 'ColorBends',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/colorbends-loop.mp4',
      seamlessLoop: true,
      videoDuration: 75,
      crossfadeDuration: 5,
      hueRotate: 0,
      saturation: 100,
      brightness: 100,
      opacity: 1
    }
  },
  {
    name: 'Iridescence',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/iridescence-loop.mp4',
      seamlessLoop: true,
      videoDuration: 75,
      crossfadeDuration: 5,
      hueRotate: 0,
      saturation: 100,
      brightness: 100,
      opacity: 1
    }
  },
  {
    name: 'Galaxy',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/galaxy-loop.mp4',
      seamlessLoop: true,
      videoDuration: 75,
      crossfadeDuration: 5,
      hueRotate: 0,
      saturation: 120,
      brightness: 150,
      opacity: 1
    }
  },
  {
    name: 'LightPillar',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/lightpillar-loop.mp4',
      seamlessLoop: true,
      videoDuration: 75,
      crossfadeDuration: 5,
      hueRotate: 0,
      saturation: 100,
      brightness: 100,
      opacity: 1
    }
  },
  {
    name: 'FloatingLines',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/floatinglines-loop.mp4',
      seamlessLoop: true,
      videoDuration: 75,
      crossfadeDuration: 5,
      hueRotate: 0,
      saturation: 100,
      brightness: 100,
      opacity: 1
    }
  },
  {
    name: 'Particles',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/particles-loop.mp4',
      seamlessLoop: true,
      videoDuration: 75,
      crossfadeDuration: 5,
      hueRotate: 0,
      saturation: 100,
      brightness: 100,
      opacity: 1
    }
  },
  {
    name: 'Prism',
    component: VideoBackground,
    defaultProps: {
      src: '/assets/videos/prism-loop.mp4',
      seamlessLoop: true,
      videoDuration: 75,
      crossfadeDuration: 5,
      hueRotate: 0,
      saturation: 100,
      brightness: 120,
      opacity: 1
    }
  },
];

// Configurable rotation interval (in milliseconds)
// 10000ms (10s) for development testing
// 300000ms (5 min) for production - allows appreciation of each background
export const ROTATION_INTERVAL_MS = 300000;

// Transition duration (20% of rotation interval for smooth crossfade)
export const TRANSITION_DURATION_MS = ROTATION_INTERVAL_MS / 5; // 6 seconds

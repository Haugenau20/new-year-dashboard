// Recording mode backgrounds - uses WebGL for capturing videos
import DarkVeil from '../components/DarkVeil';
import ColorBends from '../components/ColorBends';
import Iridescence from '../components/Iridescence';
import Prism from '../components/Prism';
import PrismaticBurst from '../components/PrismaticBurst';
import { BackgroundPreset } from './backgrounds';
import Galaxy from '../components/Galaxy';
import LightPillar from '../components/LightPillar';
import FloatingLines from '../components/FloatingLines';
import Particles from '../components/Particles';

export const RECORDING_BACKGROUNDS: BackgroundPreset[] = [
  {
    name: 'DarkVeil',
    component: DarkVeil,
    defaultProps: {
      hueShift: 200,
      noiseIntensity: 0.01,
      scanlineIntensity: 0,
      speed: 0.5,
      scanlineFrequency: 0,
      warpAmount: 0.8,
      resolutionScale: 1.3,
    },
  },
  {
    name: 'ColorBends',
    component: ColorBends,
    defaultProps: {
      colors: ['#501D6A', '#EFD466', '#501D6A'],
      speed: 0.15,
      transparent: false,
      rotation: 45,
      autoRotate: 0,
      scale: 1.2,
      frequency: 1,
      warpStrength: 1.0,
      mouseInfluence: 0,
      parallax: 0,
      noise: 0.03,
    },
  },
  {
    name: 'Iridescence',
    component: Iridescence,
    defaultProps: {
      color: [0.6, 0.6, 0.6] as [number, number, number],
      speed: 0.6,
      amplitude: 0.1,
      mouseReact: false,
    },
  },
  {
    name: 'Prism',
    component: Prism,
    defaultProps: {
      height: 15,
      baseWidth: 20,
      animationType: 'rotate' as const,
      glow: 0.2,
      offset: { x: 0, y: -50 },
      noise: 0.02,
      transparent: false,
      scale: 1.0,
      hueShift: 0.7,
      colorFrequency: 0.5,
      timeScale: 0.15,
    },
  },
  {
    name: 'PrismaticBurst',
    component: PrismaticBurst,
    defaultProps: {
      intensity: 2,
      colors: ['#CC232A', '#F5AC27', '#F2888B'],
      speed: 0.2,
      distort: 1,
      paused: false,
      rayCount: 0,
    },
  },
  {
    name: 'Galaxy',
    component: Galaxy,
    defaultProps: {
        focal: [0.5, 0.5],
        rotation: [1.0, 0.3],
        starSpeed: 0.1,
        density: 1,
        hueShift: 140,
        disableAnimation: false,
        speed: 0.4,
        mouseInteraction: false,
        glowIntensity: 0.3,
        saturation: 1,
        mouseRepulsion: false,
        twinkleIntensity: 0.7,
        rotationSpeed: 0,
        transparent: true,
    }
  },
  {
    name: 'LightPillar',
    component: LightPillar,
    defaultProps: {
      topColor: '#ffb27f',
      bottomColor: '#126fff',
      intensity: 1,
      rotationSpeed: 0.1,
      interactive: false,
      glowAmount: 0.002,
      pillarWidth: 8.0,
      pillarHeight: 0.3,
      noiseIntensity: 0.5,
      mixBlendMode: 'screen',
      pillarRotation: 120
    }
  },
  {
    name: 'FloatingLines',
    component: FloatingLines,
    defaultProps: { 
      linesGradient: ['#0000ff', '#d4af37', '#0000ff', '#d4af37'],
      enabledWaves: ['top', 'middle', 'bottom'],
      lineCount: 6,
      lineDistance: 30,
      animationSpeed: 1,
      interactive: false,
      parallax: false,
      mixBlendMode: 'screen'
    }
  },
  {
    name: 'Particles',
    component: Particles,
    defaultProps: {
      particleCount: 600,
      particleSpread: 20,
      speed: 0.02,
      particleColors: ['#d4af37', '#2070b9', '#abf0ff'],
      moveParticlesOnHover: false,
      alphaParticles: false,
      particleBaseSize: 800,
      sizeRandomness: 1,
      cameraDistance: 30,
      disableRotation: false,
      pixelRatio: 5, 
    }
  }
];

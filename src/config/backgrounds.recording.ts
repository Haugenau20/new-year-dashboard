// Recording mode backgrounds - uses WebGL for capturing videos
import DarkVeil from '../components/DarkVeil';
import Iridescence from '../components/Iridescence';
import ColorBends from '../components/ColorBends';
import { BackgroundPreset } from './backgrounds';

export const RECORDING_BACKGROUNDS: BackgroundPreset[] = [
  {
    name: 'DarkVeil',
    component: DarkVeil,
    defaultProps: {
      hueShift: 200,         // Vibrant cyan/blue colors baked in
      noiseIntensity: 0.01,
      scanlineIntensity: 0,
      speed: 0.8,
      scanlineFrequency: 0,
      warpAmount: 0.8,
      resolutionScale: 1.0, // Full resolution for recording
    },
  },
  {
    name: 'ColorBends',
    component: ColorBends,
    defaultProps: {
      colors: ['#1a2a4e', '#2d4a7c', '#4a6fa5'], // Deep vibrant blues - baked in color!
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
      color: [0.2, 0.5, 0.8] as [number, number, number], // Vibrant blue baked in
      speed: 0.6,
      amplitude: 0.1,
      mouseReact: false,
    },
  },
  {
    name: 'DarkVeil Variant',
    component: DarkVeil,
    defaultProps: {
      hueShift: 280,         // Purple/magenta colors baked in
      noiseIntensity: 0.03,
      scanlineIntensity: 0,
      speed: 1.2,
      scanlineFrequency: 0,
      warpAmount: 0.5,
      resolutionScale: 1.0,
    },
  },
  {
    name: 'ColorBends Variant',
    component: ColorBends,
    defaultProps: {
      colors: ['#4a1a4e', '#7c2d7c', '#a54a9f'], // Vibrant purples baked in
      speed: 0.25,
      transparent: false,
      rotation: 135,
      autoRotate: 0,
      scale: 1.5,
      frequency: 0.8,
      warpStrength: 1.2,
      mouseInfluence: 0,
      parallax: 0,
      noise: 0.04,
    },
  },
  {
    name: 'Iridescence Variant',
    component: Iridescence,
    defaultProps: {
      color: [0.8, 0.3, 0.5] as [number, number, number], // Pink/magenta baked in
      speed: 0.9,
      amplitude: 0.15,
      mouseReact: false,
    },
  },
];

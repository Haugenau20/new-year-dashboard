import { useState, useEffect } from 'react';
import './BorderRecorder.css';

interface AnimationPreset {
  name: string;
  description: string;
  performance: 'Low' | 'Medium' | 'High';
  className: string;
}

/**
 * Border Recorder Page
 * Showcase of 10 CSS border animations for performance testing
 * Keyboard controls:
 * - Arrow Left/Right: Cycle through animations
 * - 0-9: Jump to specific animation
 * - H: Toggle help overlay
 */
export function BorderRecorder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(true);

  // 10 different CSS animation presets
  const animations: AnimationPreset[] = [
    {
      name: 'Rotating Gradient',
      description: 'Smooth rotating linear gradient',
      performance: 'Low',
      className: 'border-anim-rotating-gradient'
    },
    {
      name: 'Pulsing Glow',
      description: 'Pulsing box-shadow with color shift',
      performance: 'Low',
      className: 'border-anim-pulsing-glow'
    },
    {
      name: 'Shimmer Wave',
      description: 'Sweeping shine effect',
      performance: 'Medium',
      className: 'border-anim-shimmer-wave'
    },
    {
      name: 'Rainbow Spin',
      description: 'Full spectrum hue rotation',
      performance: 'Medium',
      className: 'border-anim-rainbow-spin'
    },
    {
      name: 'Electric Pulse',
      description: 'Multi-layer pulsing glow',
      performance: 'Medium',
      className: 'border-anim-electric-pulse'
    },
    {
      name: 'Conic Gradient Spin',
      description: 'Rotating conic gradient',
      performance: 'Medium',
      className: 'border-anim-conic-spin'
    },
    {
      name: 'Multi-Glow Layers',
      description: 'Multiple animated shadow layers',
      performance: 'High',
      className: 'border-anim-multi-glow'
    },
    {
      name: 'Color Wave',
      description: 'Gradient position with color shifts',
      performance: 'High',
      className: 'border-anim-color-wave'
    },
    {
      name: 'Sparkle Border',
      description: 'Multiple glowing spots traveling',
      performance: 'High',
      className: 'border-anim-sparkle'
    },
    {
      name: 'Neon Flicker',
      description: 'Energetic brightness variation',
      performance: 'High',
      className: 'border-anim-neon-flicker'
    }
  ];

  const currentAnimation = animations[currentIndex];

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setCurrentIndex((prev) => (prev - 1 + animations.length) % animations.length);
          break;
        case 'ArrowRight':
          setCurrentIndex((prev) => (prev + 1) % animations.length);
          break;
        case 'h':
        case 'H':
          setShowHelp((prev) => !prev);
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const index = parseInt(e.key);
          if (index < animations.length) {
            setCurrentIndex(index);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Hide help overlay after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelp(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative flex items-center justify-center">
      {/* Border Display - Centered */}
      <div style={{ width: '320px' }}>
        <div className={`border-showcase-card ${currentAnimation.className}`}>
          <div className="border-showcase-content bg-gradient-gold shadow-gold">
            {/* Mock content to show border context */}
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded flex-shrink-0" style={{ width: '64px', height: '64px' }} />
              <div className="flex-1 min-w-0">
                <div className="bg-white/20 rounded mb-2" style={{ height: '20px', width: '80%' }} />
                <div className="bg-white/10 rounded" style={{ height: '16px', width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Overlay */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-6">CSS Border Animation Showcase</h1>
            <div className="space-y-3 text-white/90">
              <p className="text-xl mb-4">
                <span className="font-bold text-yellow-400">{currentAnimation.name}</span>
                <span className="ml-3 text-sm px-2 py-1 rounded bg-white/10">
                  {currentAnimation.performance} Performance
                </span>
              </p>
              <p className="text-base text-white/70 mb-4">{currentAnimation.description}</p>
              <div className="space-y-2 text-lg">
                <div><kbd className="bg-white/20 px-3 py-1 rounded">←</kbd> <kbd className="bg-white/20 px-3 py-1 rounded">→</kbd> Cycle through animations</div>
                <div><kbd className="bg-white/20 px-3 py-1 rounded">0-9</kbd> Jump to specific animation</div>
                <div><kbd className="bg-white/20 px-3 py-1 rounded">H</kbd> Toggle this help</div>
              </div>
              <p className="text-sm text-white/60 mt-6">
                Test each animation on your Google TV to check performance
              </p>
              <p className="text-sm text-white/60">
                Press <kbd className="bg-white/20 px-2 py-0.5 rounded text-xs">H</kbd> to hide this overlay
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {showHelp && (
        <div className="fixed top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg px-4 py-2 text-white/80 z-40">
          <div className="text-sm">
            <span className="font-mono">{currentIndex + 1}/{animations.length}</span>
            <span className="mx-2">•</span>
            <span className="font-semibold">{currentAnimation.name}</span>
          </div>
          <div className="text-xs text-white/50 mt-1">
            Performance: {currentAnimation.performance}
          </div>
          <div className="text-xs text-white/50 mt-1">
            Press <kbd className="bg-white/10 px-1 rounded text-[10px]">H</kbd> for help
          </div>
        </div>
      )}
    </div>
  );
}

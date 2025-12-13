import { useState, useEffect } from 'react';
import { RECORDING_BACKGROUNDS } from '../config/backgrounds.recording';
import { AnimatedBackground } from '../components/AnimatedBackground';

/**
 * Background Recorder Page
 * Clean view of backgrounds for recording - no UI elements
 * Keyboard controls:
 * - Arrow Left/Right: Switch backgrounds
 * - Space: Pause/Resume animation
 * - H: Toggle help overlay
 */
export function BackgroundRecorder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const currentBackground = RECORDING_BACKGROUNDS[currentIndex];

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setCurrentIndex((prev) => (prev - 1 + RECORDING_BACKGROUNDS.length) % RECORDING_BACKGROUNDS.length);
          break;
        case 'ArrowRight':
          setCurrentIndex((prev) => (prev + 1) % RECORDING_BACKGROUNDS.length);
          break;
        case ' ':
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
        case 'h':
        case 'H':
          setShowHelp((prev) => !prev);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const index = parseInt(e.key) - 1;
          if (index < RECORDING_BACKGROUNDS.length) {
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
  }, [currentIndex]); // Reset timer when background changes

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Background (full opacity, no dimming) */}
      <div
        className="fixed inset-0"
        style={{
          opacity: isPaused ? 0.3 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        <AnimatedBackground
          preset={currentBackground}
          props={currentBackground.defaultProps}
        />
      </div>

      {/* Help Overlay */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-6">Background Recorder</h1>
            <div className="space-y-3 text-white/90">
              <p className="text-xl mb-4">
                Current: <span className="font-bold text-purple-400">{currentBackground.name}</span> ({currentIndex + 1}/{RECORDING_BACKGROUNDS.length})
              </p>
              <div className="space-y-2 text-lg">
                <div><kbd className="bg-white/20 px-3 py-1 rounded">←</kbd> <kbd className="bg-white/20 px-3 py-1 rounded">→</kbd> Switch backgrounds</div>
                <div><kbd className="bg-white/20 px-3 py-1 rounded">1-9</kbd> Jump to specific background</div>
                <div><kbd className="bg-white/20 px-3 py-1 rounded">Space</kbd> Pause/Resume</div>
                <div><kbd className="bg-white/20 px-3 py-1 rounded">H</kbd> Toggle this help</div>
              </div>
              <p className="text-sm text-white/60 mt-6">
                Press <kbd className="bg-white/20 px-2 py-0.5 rounded text-xs">H</kbd> to hide this overlay
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Status Indicator (hidden when help is hidden) */}
      {showHelp && (
        <div className="fixed top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg px-4 py-2 text-white/80 z-40">
          <div className="text-sm">
            <span className="font-mono">{currentIndex + 1}/{RECORDING_BACKGROUNDS.length}</span>
            <span className="mx-2">•</span>
            <span className="font-semibold">{currentBackground.name}</span>
            {isPaused && <span className="ml-2 text-yellow-400">(Paused)</span>}
          </div>
          <div className="text-xs text-white/50 mt-1">
            Press <kbd className="bg-white/10 px-1 rounded text-[10px]">H</kbd> for help
          </div>
        </div>
      )}
    </div>
  );
}

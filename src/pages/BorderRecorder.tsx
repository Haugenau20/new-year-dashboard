import { useState, useEffect } from 'react';
import ElectricBorder from '../components/ElectricBorder';

/**
 * Border Recorder Page
 * Clean view of ElectricBorder effect for recording - no UI elements
 * Keyboard controls:
 * - Arrow Left/Right or 1/2: Switch between large and small border sizes
 * - H: Toggle help overlay
 */
export function BorderRecorder() {
  const [currentSize, setCurrentSize] = useState<'large' | 'small'>('large');
  const [showHelp, setShowHelp] = useState(true);

  // Border configurations matching QueueDisplay usage
  const borderConfigs = {
    large: {
      name: 'Large Border (Main "Up Next")',
      width: 320,
      thickness: 3,
      borderRadius: 8,
      color: '#FFD700',
      speed: 1.5,
      chaos: 0.8
    },
    small: {
      name: 'Small Border (Additional Songs)',
      width: 240,
      thickness: 2,
      borderRadius: 6,
      color: '#FFD700',
      speed: 1.5,
      chaos: 0.8
    }
  };

  const currentConfig = borderConfigs[currentSize];

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setCurrentSize('large');
          break;
        case 'ArrowRight':
          setCurrentSize('small');
          break;
        case 'h':
        case 'H':
          setShowHelp((prev) => !prev);
          break;
        case '1':
          setCurrentSize('large');
          break;
        case '2':
          setCurrentSize('small');
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
  }, [currentSize]); // Reset timer when size changes

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative flex items-center justify-center">
      {/* Border Display - Centered */}
      <div
        style={{
          width: `${currentConfig.width}px`,
        }}
      >
        <ElectricBorder
          color={currentConfig.color}
          speed={currentConfig.speed}
          chaos={currentConfig.chaos}
          thickness={currentConfig.thickness}
          style={{ borderRadius: currentConfig.borderRadius }}
        >
          <div
            className="bg-gradient-gold shadow-gold"
            style={{
              borderRadius: `${currentConfig.borderRadius}px`,
              padding: currentSize === 'large' ? '16px' : '8px',
              minHeight: currentSize === 'large' ? '96px' : '48px',
            }}
          >
            {/* Mock content to show border context */}
            <div className="flex items-center gap-4" style={{ gap: currentSize === 'large' ? '16px' : '8px' }}>
              <div
                className="bg-white/10 rounded flex-shrink-0"
                style={{
                  width: currentSize === 'large' ? '64px' : '32px',
                  height: currentSize === 'large' ? '64px' : '32px'
                }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="bg-white/20 rounded mb-2"
                  style={{
                    height: currentSize === 'large' ? '20px' : '14px',
                    width: '80%'
                  }}
                />
                <div
                  className="bg-white/10 rounded"
                  style={{
                    height: currentSize === 'large' ? '16px' : '12px',
                    width: '60%'
                  }}
                />
              </div>
            </div>
          </div>
        </ElectricBorder>
      </div>

      {/* Help Overlay */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-6">Electric Border Recorder</h1>
            <div className="space-y-3 text-white/90">
              <p className="text-xl mb-4">
                Current: <span className="font-bold text-yellow-400">{currentConfig.name}</span>
              </p>
              <div className="space-y-2 text-lg">
                <div><kbd className="bg-white/20 px-3 py-1 rounded">←</kbd> <kbd className="bg-white/20 px-3 py-1 rounded">→</kbd> Switch between sizes</div>
                <div><kbd className="bg-white/20 px-3 py-1 rounded">1</kbd> Large border (320px)</div>
                <div><kbd className="bg-white/20 px-3 py-1 rounded">2</kbd> Small border (240px)</div>
                <div><kbd className="bg-white/20 px-3 py-1 rounded">H</kbd> Toggle this help</div>
              </div>
              <p className="text-sm text-white/60 mt-6">
                Record each size separately for video assets
              </p>
              <p className="text-sm text-white/60">
                Press <kbd className="bg-white/20 px-2 py-0.5 rounded text-xs">H</kbd> to hide this overlay before recording
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Status Indicator */}
      {showHelp && (
        <div className="fixed top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg px-4 py-2 text-white/80 z-40">
          <div className="text-sm">
            <span className="font-semibold">{currentConfig.name}</span>
          </div>
          <div className="text-xs text-white/50 mt-1">
            {currentConfig.width}px × thickness: {currentConfig.thickness}px
          </div>
          <div className="text-xs text-white/50 mt-1">
            Press <kbd className="bg-white/10 px-1 rounded text-[10px]">H</kbd> for help
          </div>
        </div>
      )}
    </div>
  );
}

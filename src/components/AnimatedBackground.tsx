import { memo } from 'react';
import { BackgroundPreset } from '../config/backgrounds';

interface AnimatedBackgroundProps {
  preset: BackgroundPreset;
  props: Record<string, any>;
}

export const AnimatedBackground = memo(function AnimatedBackground({ preset, props }: AnimatedBackgroundProps) {
  const BackgroundComponent = preset.component;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'block',
      }}
    >
      <BackgroundComponent {...props} />
    </div>
  );
});

import { useRef, useEffect } from 'react';

interface VideoBackgroundProps {
  src: string;
  hueRotate?: number;
  saturation?: number;
  brightness?: number;
  opacity?: number;
}

export default function VideoBackground({
  src,
  hueRotate = 0,
  saturation = 100,
  brightness = 100,
  opacity = 0.6
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays (some browsers require explicit play call)
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented
        console.warn('Video autoplay failed:', error);
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
        // Videos recorded with color baked in - filters shift those colors for special songs
        filter: `hue-rotate(${hueRotate}deg) saturate(${saturation}%) brightness(${brightness}%)`
      }}
    />
  );
}

import { useRef, useEffect, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
  hueRotate?: number;
  saturation?: number;
  brightness?: number;
  opacity?: number;
  seamlessLoop?: boolean; // Enable self-crossfading for seamless loops
  videoDuration?: number; // Total video duration in seconds (e.g., 75)
  crossfadeDuration?: number; // Crossfade duration in seconds (e.g., 5)
}

export default function VideoBackground({
  src,
  hueRotate = 0,
  saturation = 100,
  brightness = 100,
  opacity = 0.6,
  seamlessLoop = false,
  videoDuration = 75,
  crossfadeDuration = 5
}: VideoBackgroundProps) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [videoAOpacity, setVideoAOpacity] = useState(1);
  const [videoBOpacity, setVideoBOpacity] = useState(0);
  const [actualDuration, setActualDuration] = useState(videoDuration);

  useEffect(() => {
    if (!seamlessLoop) {
      // Standard looping behavior
      const video = videoARef.current;
      if (!video) return;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Video autoplay failed:', error);
        });
      }
      return;
    }

    // Seamless loop behavior with self-crossfading
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    // Detect actual video duration when metadata loads
    const handleMetadataLoaded = (video: HTMLVideoElement) => {
      if (video.duration && isFinite(video.duration)) {
        setActualDuration(video.duration);
      }
    };

    const handleAMetadata = () => handleMetadataLoaded(videoA);
    const handleBMetadata = () => handleMetadataLoaded(videoB);

    videoA.addEventListener('loadedmetadata', handleAMetadata);
    videoB.addEventListener('loadedmetadata', handleBMetadata);

    const crossfadeStart = actualDuration - crossfadeDuration;
    let activeVideo: 'A' | 'B' = 'A';

    // Start video A
    videoA.play().catch(error => {
      console.warn('Video A autoplay failed:', error);
    });

    const handleTimeUpdate = (video: HTMLVideoElement, isVideoA: boolean) => {
      const currentTime = video.currentTime;

      if (currentTime >= crossfadeStart && currentTime < actualDuration) {
        // In crossfade zone
        const progress = (currentTime - crossfadeStart) / crossfadeDuration;

        if (isVideoA && activeVideo === 'A') {
          // Video A is active and in crossfade zone - start B and crossfade
          if (videoBRef.current && videoBRef.current.paused) {
            videoBRef.current.currentTime = 0;
            videoBRef.current.play();
          }
          setVideoAOpacity(1 - progress);
          setVideoBOpacity(progress);

          if (progress >= 0.95) {
            activeVideo = 'B';
          }
        } else if (!isVideoA && activeVideo === 'B') {
          // Video B is active and in crossfade zone - start A and crossfade
          if (videoARef.current && videoARef.current.paused) {
            videoARef.current.currentTime = 0;
            videoARef.current.play();
          }
          setVideoBOpacity(1 - progress);
          setVideoAOpacity(progress);

          if (progress >= 0.95) {
            activeVideo = 'A';
          }
        }
      }
    };

    // Fallback: If video ends without proper crossfade, restart it
    const handleVideoEnded = (video: HTMLVideoElement, isVideoA: boolean) => {
      if (video && !video.paused) {
        video.currentTime = 0;
        video.play();
      }
    };

    const handleAEnded = () => handleVideoEnded(videoA, true);
    const handleBEnded = () => handleVideoEnded(videoB, false);

    const handleATimeUpdate = () => handleTimeUpdate(videoA, true);
    const handleBTimeUpdate = () => handleTimeUpdate(videoB, false);

    videoA.addEventListener('timeupdate', handleATimeUpdate);
    videoB.addEventListener('timeupdate', handleBTimeUpdate);
    videoA.addEventListener('ended', handleAEnded);
    videoB.addEventListener('ended', handleBEnded);

    return () => {
      videoA.removeEventListener('loadedmetadata', handleAMetadata);
      videoB.removeEventListener('loadedmetadata', handleBMetadata);
      videoA.removeEventListener('timeupdate', handleATimeUpdate);
      videoB.removeEventListener('timeupdate', handleBTimeUpdate);
      videoA.removeEventListener('ended', handleAEnded);
      videoB.removeEventListener('ended', handleBEnded);
    };
  }, [src, seamlessLoop, actualDuration, crossfadeDuration]);

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    filter: `hue-rotate(${hueRotate}deg) saturate(${saturation}%) brightness(${brightness}%)`
  };

  if (!seamlessLoop) {
    // Standard single video with loop
    return (
      <video
        ref={videoARef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          ...videoStyle,
          opacity
        }}
      />
    );
  }

  // Seamless loop with two videos crossfading
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoARef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          ...videoStyle,
          opacity: videoAOpacity * opacity,
          transition: `opacity ${crossfadeDuration}s linear`
        }}
      />
      <video
        ref={videoBRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        style={{
          ...videoStyle,
          opacity: videoBOpacity * opacity,
          transition: `opacity ${crossfadeDuration}s linear`
        }}
      />
    </div>
  );
}

// CREDIT
// Component inspired by @BalintFerenczy on X
// https://codepen.io/BalintFerenczy/pen/KwdoyEN

import { useEffect, useRef, CSSProperties } from 'react';

interface ElectricBorderProps {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  style?: CSSProperties;
  className?: string;
}

export function ElectricBorder({
  children,
  color = '#7df9ff',
  speed = 1,
  chaos = 0.5,
  thickness = 2,
  style = {},
  className = '',
}: ElectricBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 20; // Extra space for the border to flow freely

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width + padding * 2;
      canvas.height = rect.height + padding * 2;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    let frame = 0;
    const points: { x: number; y: number; vx: number; vy: number }[] = [];
    const numPoints = 30;

    // Initialize points around the border (accounting for padding)
    const innerWidth = canvas.width - padding * 2;
    const innerHeight = canvas.height - padding * 2;

    for (let i = 0; i < numPoints; i++) {
      const progress = i / numPoints;
      const perimeter = 2 * (innerWidth + innerHeight);
      const distance = progress * perimeter;

      let x, y;
      if (distance < innerWidth) {
        x = padding + distance;
        y = padding;
      } else if (distance < innerWidth + innerHeight) {
        x = padding + innerWidth;
        y = padding + (distance - innerWidth);
      } else if (distance < 2 * innerWidth + innerHeight) {
        x = padding + innerWidth - (distance - innerWidth - innerHeight);
        y = padding + innerHeight;
      } else {
        x = padding;
        y = padding + innerHeight - (distance - 2 * innerWidth - innerHeight);
      }

      points.push({
        x,
        y,
        vx: (Math.random() - 0.5) * chaos,
        vy: (Math.random() - 0.5) * chaos,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update points with chaos
      points.forEach((point, i) => {
        const progress = i / numPoints;
        const perimeter = 2 * (innerWidth + innerHeight);
        const baseDistance = progress * perimeter;

        let baseX, baseY;
        if (baseDistance < innerWidth) {
          baseX = padding + baseDistance;
          baseY = padding;
        } else if (baseDistance < innerWidth + innerHeight) {
          baseX = padding + innerWidth;
          baseY = padding + (baseDistance - innerWidth);
        } else if (baseDistance < 2 * innerWidth + innerHeight) {
          baseX = padding + innerWidth - (baseDistance - innerWidth - innerHeight);
          baseY = padding + innerHeight;
        } else {
          baseX = padding;
          baseY = padding + innerHeight - (baseDistance - 2 * innerWidth - innerHeight);
        }

        // Add velocity for chaos
        point.x += point.vx * speed;
        point.y += point.vy * speed;

        // Dampen velocity
        point.vx *= 0.95;
        point.vy *= 0.95;

        // Add new random velocity
        point.vx += (Math.random() - 0.5) * chaos * 0.5;
        point.vy += (Math.random() - 0.5) * chaos * 0.5;

        // Pull back to base position
        point.x += (baseX - point.x) * 0.1;
        point.y += (baseY - point.y) * 0.1;
      });

      // Draw glowing line connecting points
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw brighter inner glow
      ctx.shadowBlur = 5;
      ctx.lineWidth = thickness * 0.5;
      ctx.strokeStyle = color;
      ctx.stroke();

      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, speed, chaos, thickness]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          width: 'calc(100% + 40px)',
          height: 'calc(100% + 40px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
}

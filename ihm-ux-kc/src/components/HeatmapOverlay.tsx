import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { ClickPoint } from '../context/RecorderContext';

interface Props {
  points: ClickPoint[];
}

const HeatmapOverlay: React.FC<Props> = ({ points }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();

  const getGradientPalette = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 256;
    canvas.height = 1;

    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    
    grad.addColorStop(0.0, 'rgba(255, 255, 0, 0)');
    grad.addColorStop(0.3, 'rgba(255, 255, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(255, 165, 0, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 69, 0, 0.9)');
    grad.addColorStop(1.0, 'rgba(255, 0, 0, 1)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 1);

    return ctx.getImageData(0, 0, 256, 1).data;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = document.documentElement.scrollWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentPathPoints = points.filter(p => p.path === location.pathname);

    if (currentPathPoints.length > 0) {
      currentPathPoints.forEach(point => {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, 25
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(point.x - 25, point.y - 25, 50, 50);
      });

      const palette = getGradientPalette();
      if (palette) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha > 0) {
            const offset = Math.min(255, alpha) * 4;
            data[i] = palette[offset];
            data[i + 1] = palette[offset + 1];
            data[i + 2] = palette[offset + 2];
            data[i + 3] = palette[offset + 3];
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [points, location.pathname]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 z-[9998] pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default HeatmapOverlay;
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
    
    // Alpha 0.0 à 0.1 : Transparent
    grad.addColorStop(0.0, 'rgba(0,0,0,0)');
    
    // Alpha ~0.25 (1 clic) : VERT
    grad.addColorStop(0.2, 'rgba(0, 255, 0, 0.9)'); 
    grad.addColorStop(0.3, 'rgba(0, 255, 0, 1)');

    // Alpha ~0.50 (2 clics) : JAUNE
    grad.addColorStop(0.45, 'rgba(255, 255, 0, 1)');
    grad.addColorStop(0.55, 'rgba(255, 255, 0, 1)');

    // Alpha ~0.75 (3 clics) : ORANGE
    grad.addColorStop(0.7, 'rgba(255, 165, 0, 1)');
    grad.addColorStop(0.8, 'rgba(255, 165, 0, 1)');

    // Alpha > 0.8 (4+ clics) : ROUGE
    grad.addColorStop(0.9, 'rgba(255, 0, 0, 1)');
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
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'black'; 
        
        currentPathPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; 
            ctx.fill();
        });

        const palette = getGradientPalette();
        if (palette) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 0) {
                    const offset = alpha * 4;
                    data[i] = palette[offset];     // R
                    data[i + 1] = palette[offset + 1]; // G
                    data[i + 2] = palette[offset + 2]; // B
                    data[i + 3] = palette[offset + 3]; // A
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
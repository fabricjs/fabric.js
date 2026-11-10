import { useEffect } from 'react';
import { setupCanvasBanner } from './setupCanvasBanner';

import './coolCanvasBanner.css';

const useCanvasInit = () => {
  useEffect(() => {
    const container = document.getElementById('featuredBanner');
    const canvasEl = document.getElementById('canvasbanner');
    const { resizeObserver, fabricCanvas } = setupCanvasBanner({
      container,
      canvasEl,
    });
    return () => {
      resizeObserver.unobserve(container);
      return fabricCanvas.dispose();
    };
  }, []);
  return null;
};

export const CoolCanvasBanner = () => {
  useCanvasInit();

  return <canvas id="canvasbanner"></canvas>;
};

import { getEnv } from '../../env';

/**
 * Creates a canvas element that is a copy of another and is also painted
 * @param {CanvasElement} canvas to copy size and content of
 * @return {CanvasElement} initialized canvas element
 */
export const copyCanvasElement = (canvas: HTMLCanvasElement) => {
  const newCanvas = getEnv().createCanvasElement(canvas.width, canvas.height);
  newCanvas.getContext('2d')?.drawImage(canvas, 0, 0);
  return newCanvas;
};

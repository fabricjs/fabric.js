import { StaticCanvas } from './StaticCanvas';

describe('StaticCanvas', () => {
  it('toBlob', async () => {
    const canvas = new StaticCanvas(undefined, { width: 300, height: 300 });
    const blob = await canvas.toBlob({
      multiplier: 3,
    });
    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toBe('image/png');
  });
  it('attempts webp format but may fallback to png in node environment', () => {
    const canvas = new StaticCanvas(undefined, { width: 300, height: 300 });
    const dataURL = canvas.toDataURL({
      format: 'webp',
      multiplier: 1,
    });
    /**
     * In browser environments this would be 'data:image/webp'
     * In Node.js environment (node-canvas) it falls back to PNG.
     * @see https://github.com/Automattic/node-canvas/issues/1258 for possible workaround
     */
    expect(dataURL).toMatch(/^data:image\/(webp|png)/);
  });

  it('prevents multiple canvas initialization', () => {
    const canvas = new StaticCanvas();
    expect(canvas.lowerCanvasEl).toBeTruthy();
    expect(() => new StaticCanvas(canvas.lowerCanvasEl)).toThrow();
  });

  it('has correct initial properties', () => {
    const canvas = new StaticCanvas();
    expect('backgroundColor' in canvas).toBeTruthy();
    expect('overlayColor' in canvas).toBeTruthy();
    expect('includeDefaultValues' in canvas).toBeTruthy();
    expect('renderOnAddRemove' in canvas).toBeTruthy();
    expect('controlsAboveOverlay' in canvas).toBeTruthy();
    expect('allowTouchScrolling' in canvas).toBeTruthy();
    expect('imageSmoothingEnabled' in canvas).toBeTruthy();
    expect('backgroundVpt' in canvas).toBeTruthy();
    expect('overlayVpt' in canvas).toBeTruthy();
    expect(Array.isArray(canvas._objects)).toBeTruthy();
    expect(canvas._objects.length).toBe(0);

    expect(canvas.includeDefaultValues).toBe(true);
    expect(canvas.renderOnAddRemove).toBe(true);
    expect(canvas.controlsAboveOverlay).toBe(false);
    expect(canvas.allowTouchScrolling).toBe(false);
    expect(canvas.imageSmoothingEnabled).toBe(true);
    expect(canvas.backgroundVpt).toBe(true);
    expect(canvas.overlayVpt).toBe(true);

    expect(canvas.viewportTransform).not.toBe(canvas2.viewportTransform);
  });
});

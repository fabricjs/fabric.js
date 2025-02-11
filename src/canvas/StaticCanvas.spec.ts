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
});

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
    // In browser environments this would be 'data:image/webp'
    // In Node.js it falls back to PNG per HTML spec
    expect(dataURL).toMatch(/^data:image\/(webp|png)/);
  });
});

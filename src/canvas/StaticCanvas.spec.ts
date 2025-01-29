import { StaticCanvas } from './StaticCanvas';

import { it, expect, describe } from 'vitest';

describe('StaticCanvas', () => {
  it('toBlob', async () => {
    const canvas = new StaticCanvas(undefined, { width: 300, height: 300 });
    const blob = await canvas.toBlob({
      multiplier: 3,
    });
    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toBe('image/png');
  });
});

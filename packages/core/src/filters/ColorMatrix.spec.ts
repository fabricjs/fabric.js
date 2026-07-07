import { ColorMatrix } from './ColorMatrix';
import type { T2DPipelineState } from './typedefs';

import { describe, expect, it } from 'vitest';

describe('ColorMatrix', () => {
  it('apply2D colorsOnly: true', () => {
    const filter = new ColorMatrix({
      matrix: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      colorsOnly: true,
    });
    const inputData = {
      imageData: {
        data: [1, 2, 3, 4],
      },
    } as unknown as T2DPipelineState;
    filter.applyTo2d(inputData);
    expect(JSON.stringify(inputData.imageData.data)).toBe('[1289,2594,3899,4]');
  });
  it('apply2D colorsOnly: false', () => {
    const filter = new ColorMatrix({
      matrix: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      colorsOnly: false,
    });
    const inputData = {
      imageData: {
        data: [1, 2, 3, 4],
      },
    } as unknown as T2DPipelineState;
    filter.applyTo2d(inputData);
    expect(JSON.stringify(inputData.imageData.data)).toBe(
      '[1305,2630,3955,5280]',
    );
  });
});

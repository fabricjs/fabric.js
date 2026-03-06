import { describe, test, expect } from 'vitest';
import { Control, Gradient } from 'fabric';
import { createLinearGradientControls } from './linearGradientControls';

describe('createLinearGradientControls', () => {
  test('returns an object as many controls as necessary', () => {
    const gradient = new Gradient({
      type: 'linear',
      // gradientTransform: [1, 0, 0, 2, 50, 40], <-- unsupported yet
      coords: {
        x1: 20,
        x2: 380,
        y1: 20,
        y2: 230,
      },
      colorStops: [
        {
          offset: 0.2,
          color: 'red',
        },
        {
          offset: 0.4,
          color: 'green',
        },
        {
          offset: 0.6,
          color: 'blue',
        },
        {
          offset: 0.8,
          color: 'yellow',
        },
      ],
    });
    const controls = createLinearGradientControls(gradient);
    expect(typeof controls).toBe('object');
    expect(Object.keys(controls)).toEqual(
      expect.arrayContaining([
        'lgp_1',
        'lgo_0',
        'lgo_1',
        'lgo_2',
        'lgo_3',
        'lgp_2',
      ]),
    );
    Object.values(controls).forEach((control) => {
      expect(control).toBeInstanceOf(Control);
    });
  });
});

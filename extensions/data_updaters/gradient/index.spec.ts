import { describe, vitest, expect, test } from 'vitest';
import type {
  SerializedGradientProps,
  GradientOptions,
  ColorStop,
} from 'fabric';
import { Gradient } from 'fabric';

const oldGradientOptions: GradientOptions<'linear'> & {
  colorStops: (ColorStop & { opacity?: number })[];
} = {
  type: 'linear',
  colorStops: [
    {
      color: 'red',
      offset: 1,
      opacity: 0.5,
    },
    {
      color: 'rgba(0,0,255,0.5)',
      offset: 0.5,
    },
    {
      color: 'rgba(0,255,0,0.5)',
      offset: 0,
      opacity: 0.3,
    },
  ],
};

const oldSerializedGradient: SerializedGradientProps & {
  colorStops: (ColorStop & { opacity?: number })[];
} = {
  type: 'linear',
  colorStops: [
    {
      color: 'red',
      offset: 1,
      opacity: 0.5,
    },
    {
      color: 'rgba(0,0,255,0.5)',
      offset: 0.5,
    },
    {
      color: 'rgba(0,255,0,0.5)',
      offset: 0,
      opacity: 0.3,
    },
  ],
};

const addColorStopMock = vitest.fn();

const ctxMock = {
  createLinearGradient: () => ({
    addColorStop: addColorStopMock,
  }),
} as unknown as CanvasRenderingContext2D;

describe('installGradientUpdater', () => {
  describe('Without using it opacity information is lost', () => {
    test('Init gradient from options preserve old color stops', () => {
      const gradient = new Gradient(oldGradientOptions);
      expect(gradient.colorStops).toMatchSnapshot();
    });
    test('old color stops do not render the old opacity', () => {
      const gradient = new Gradient(oldGradientOptions);
      gradient.toLive(ctxMock);
      oldGradientOptions.colorStops.forEach((colorStop) => {
        expect(addColorStopMock).toHaveBeenCalledWith(
          colorStop.offset,
          colorStop.color,
        );
      });
    });
  });
});

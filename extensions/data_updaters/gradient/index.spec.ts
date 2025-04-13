import { describe, vitest, expect, test, beforeAll } from 'vitest';
import type {
  SerializedGradientProps,
  GradientOptions,
  ColorStop,
} from 'fabric';
import { Gradient } from 'fabric';
import { installGradientUpdater } from './index';

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

const oldSerializedGradient: SerializedGradientProps<'linear'> & {
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
    test('FromObject will preserve the old color stop', async () => {
      const gradient = await Gradient.fromObject(oldSerializedGradient);
      expect(gradient.colorStops).toMatchSnapshot();
    });
    test('FromObject will preserve the but wont render the old opacity', async () => {
      const gradient = await Gradient.fromObject(oldSerializedGradient);
      gradient.toLive(ctxMock);
      oldGradientOptions.colorStops.forEach((colorStop) => {
        expect(addColorStopMock).toHaveBeenCalledWith(
          colorStop.offset,
          colorStop.color,
        );
      });
    });
  });
  describe('After intalling the wrapper', () => {
    beforeAll(() => {
      installGradientUpdater();
    });
    test('Init gradient from options still preserve old color stops', () => {
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
    test('FromObject will merge the old opacity into color', async () => {
      const gradient = await Gradient.fromObject(oldSerializedGradient);
      expect(gradient.colorStops).toMatchSnapshot();
    });
    test('FromObject will render with the new colors', async () => {
      const gradient = await Gradient.fromObject(oldSerializedGradient);
      gradient.toLive(ctxMock);
      oldGradientOptions.colorStops.forEach((colorStop, index) => {
        expect(addColorStopMock).toHaveBeenCalledWith(
          colorStop.offset,
          gradient.colorStops[index].color,
        );
      });
    });
  });
});

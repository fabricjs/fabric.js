import { enlivenObjects, loadImage } from './objectEnlive';
import { Rect, type RectProps } from '../../shapes/Rect';
import { Shadow } from '../../Shadow';
import { classRegistry } from '../../ClassRegistry';
import { FabricImage } from '../../../fabric';

import { describe, expect, it } from 'vitest';

const mockedRectWithCustomProperty = {
  type: 'rect',
  width: 100,
  // will become a shadow
  shadow: {
    type: 'shadow',
    blur: 5,
  },
  // will become a rect
  custom1: {
    type: 'rect',
    width: 50,
  },
  custom2: {
    type: 'nothing',
    value: 3,
  },
  // will become a set
  custom3: {
    type: 'registered',
  },
};

// TODO: this test needs to be run in real browser
// because image loading doesn't work in jsdom
describe.skip('enlivenObjects', () => {
  it('will enlive correctly', async () => {
    const [rect] = await enlivenObjects<Rect<RectProps>>([
      mockedRectWithCustomProperty,
    ]);
    expect(rect).toBeInstanceOf(Rect);
    expect(rect.shadow).toBeInstanceOf(Shadow);
    // @ts-expect-error -- custom prop
    expect(rect.custom1).toBeInstanceOf(Rect);
    // @ts-expect-error -- custom prop
    expect(rect.custom2).toEqual({
      type: 'nothing',
      value: 3,
    });
    expect(rect).toHaveProperty('custom3', {
      type: 'registered',
    });
  });
  it('will enlive correctly newly registered props', async () => {
    class Test {
      declare opts: any;

      constructor(opts: any) {
        this.opts = opts;
      }

      static async fromObject(opts: any) {
        return new this(opts);
      }
    }

    classRegistry.setClass(Test, 'registered');
    const [rect] = await enlivenObjects<Rect<RectProps>>([
      mockedRectWithCustomProperty,
    ]);
    expect(rect).toBeInstanceOf(Rect);
    expect(rect.shadow).toBeInstanceOf(Shadow);
    // @ts-expect-error -- custom prop
    expect(rect.custom1).toBeInstanceOf(Rect);

    expect(rect).toHaveProperty('custom2', {
      type: 'nothing',
      value: 3,
    });
    // @ts-expect-error -- custom prop
    expect(rect.custom3).toBeInstanceOf(Test);
  });

  describe('loadImage', () => {
    function basename(path: string) {
      return path.slice(
        Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/')) + 1,
      );
    }

    const IMG_URL = '../../../test/fixtures/very_large_image.jpg';
    const IMG_URL_NON_EXISTING = 'http://www.google.com/non-existing';

    it('loads images correctly', async () => {
      const obj = await loadImage(IMG_URL);
      if (obj) {
        const oImg = new FabricImage(obj);
        expect(
          /fixtures\/very_large_image\.jpg$/.test(oImg.getSrc()),
        ).toBeTruthy();
      }
    });

    it('handles empty image URLs', async () => {
      const img = await loadImage('');
      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.src).toBe('');
    });

    it('handles crossOrigin parameter correctly', async () => {
      const img = await loadImage(IMG_URL, {
        crossOrigin: 'anonymous',
      });
      expect(basename(img.src)).toBe(basename(IMG_URL));
      expect(img.crossOrigin).toBe('anonymous');
    });

    it('handles non-existing image URLs with proper error', async () => {
      await expect(loadImage(IMG_URL_NON_EXISTING)).rejects.toBeInstanceOf(
        Error,
      );
    });

    it('respects AbortController signals', async () => {
      const abortController = new AbortController();
      const promise = loadImage(IMG_URL, { signal: abortController.signal });
      abortController.abort();
      await expect(promise).rejects.toMatchObject({ type: 'abort' });
    });
  });
});

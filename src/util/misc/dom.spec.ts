import {
  toBlob,
  createCanvasElement,
  copyCanvasElement,
  createImage,
} from './dom';

import { it, expect, describe } from 'vitest';

describe('DOM utils', () => {
  describe('toBlob', () => {
    it('toBlob without format', async () => {
      const canvas = createCanvasElement();
      const blob = await toBlob(canvas);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob?.type).toEqual('image/png');
    });
    it('toBlob png', async () => {
      const canvas = createCanvasElement();
      const blob = await toBlob(canvas, 'png');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob?.type).toEqual('image/png');
    });
    it('toBlob jpeg', async () => {
      const canvas = createCanvasElement();
      const blob = await toBlob(canvas, 'jpeg');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob?.type).toEqual('image/jpeg');
    });
  });

  describe('copyCanvasElement', () => {
    it('correctly copies a canvas element with its content', () => {
      expect(typeof copyCanvasElement === 'function').toBeTruthy();

      const c = createCanvasElement();
      c.width = 10;
      c.height = 20;
      c.getContext('2d')!.fillStyle = 'red';
      c.getContext('2d')!.fillRect(0, 0, 10, 10);

      const b = copyCanvasElement(c);

      expect(b.width, 'width has been copied').toBe(10);
      expect(b.height, 'height has been copied').toBe(20);

      const data = b.getContext('2d')!.getImageData(1, 1, 1, 1).data;
      expect(data[0], 'red color has been copied').toBe(255);
      expect(data[1], 'red color has been copied').toBe(0);
      expect(data[2], 'red color has been copied').toBe(0);
      expect(data[3], 'red color has been copied').toBe(255);
    });
  });

  describe('createCanvasElement', () => {
    it('creates a canvas element with a context', () => {
      expect(typeof createCanvasElement === 'function').toBeTruthy();

      const element = createCanvasElement();

      expect(element.getContext).toBeTruthy();
    });
  });

  describe('createImage', () => {
    it('creates an empty image element', () => {
      expect(typeof createImage === 'function').toBeTruthy();

      const element = createImage();

      expect(element.naturalHeight).toBe(0);
      expect(element.naturalWidth).toBe(0);
    });
  });
});

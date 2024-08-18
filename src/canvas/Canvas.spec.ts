import { Canvas } from './Canvas';

describe('Canvas', () => {
  describe('touchStart', () => {
    test('will prevent default to allow touch scrolling', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: false,
      });
      const touch = {
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      };
      const evt = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      evt.preventDefault = jest.fn();
      canvas._onTouchStart(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
    });
    test('will not prevent default if allow touch scrolling is true', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
      });
      const touch = {
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      };
      const evt = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      evt.preventDefault = jest.fn();
      canvas._onTouchStart(evt);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });
  });
});

import { Canvas } from './Canvas';
import { Rect } from '../shapes/Rect';

describe('Canvas', () => {
  describe('touchStart', () => {
    test('will prevent default to not allow dom scrolling on canvas touch drag', () => {
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
    test('will not prevent default when allowTouchScrolling is true and there is no action', () => {
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
    test('will prevent default when allowTouchScrolling is true but we are drawing', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
        isDrawingMode: true,
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
    test('will prevent default when allowTouchScrolling is true and we are dragging an object', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
      });
      const rect = new Rect({
        width: 2000,
        height: 2000,
        left: -500,
        top: -500,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
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
    test('will NOT prevent default when allowTouchScrolling is true and we just lost selection', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
      });
      const rect = new Rect({
        width: 200,
        height: 200,
        left: 1000,
        top: 1000,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
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
    test('dispose after _onTouchStart', () => {
      jest.spyOn(global, 'clearTimeout');
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
        isDrawingMode: true,
      });
      const touch = {
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      };
      const evtStart = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      canvas._onTouchStart(evtStart);
      const evtEnd = new TouchEvent('touchend', {
        touches: [],
        changedTouches: [touch],
      });
      canvas._onTouchEnd(evtEnd);
      expect(canvas._willAddMouseDown).toBeGreaterThan(0);
      canvas.dispose();
      expect(global.clearTimeout).toHaveBeenCalledWith(
        canvas._willAddMouseDown,
      );
    });
  });
});

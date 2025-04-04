import { Canvas } from '../../canvas/Canvas';
import { Group } from '../Group';
import { IText } from './IText';

import { describe, expect, test, vi } from 'vitest';

describe('IText', () => {
  describe('cursor drawing width', () => {
    test.each([
      { scale: 1, zoom: 1, textScale: 1, angle: 0, textAngle: 0 },
      { scale: 1, zoom: 50, textScale: 2, angle: 0, textAngle: 0 },
      { scale: 200, zoom: 1, textScale: 2, angle: 45, textAngle: 0 },
      { scale: 200, zoom: 1, textScale: 1, angle: 0, textAngle: 0 },
      { scale: 200, zoom: 50, textScale: 1, angle: 30, textAngle: 30 },
      { scale: 200, zoom: 1 / 200, textScale: 1, angle: 0, textAngle: 0 },
      { scale: 200, zoom: 1 / 200, textScale: 2, angle: 0, textAngle: 90 },
    ])(
      'group scaled by $scale and rotated by $angle , text scaled by $textScale and rotated by $textAngle, and canvas zoomed by $zoom',
      ({ scale, zoom, textScale, angle, textAngle }) => {
        const text = new IText('testing', {
          cursorWidth: 100,
          angle: textAngle,
          scaleX: textScale,
          scaleY: textScale,
        });
        const group = new Group([text]);
        group.set({ scaleX: scale, scaleY: scale, angle });
        group.setCoords();
        const fillRect = vi.fn();
        const getZoom = vi.fn().mockReturnValue(zoom);
        const mockContext = { fillRect };
        const mockCanvas = { contextTop: mockContext, getZoom };
        Object.assign(text, {
          canvas: mockCanvas,
        });

        text.renderCursorAt(1);
        const call = fillRect.mock.calls[0];
        expect({ width: call[2], height: call[3] }).toMatchSnapshot({
          cloneDeepWith: (value) =>
            typeof value === 'number' ? value.toFixed(3) : undefined,
        });
      },
    );
  });
  describe('Interaction with mouse and editing', () => {
    test('_mouseDownHandlerBefore set up selected property', () => {
      const iText = new IText('test need some word\nsecond line');
      iText.canvas = new Canvas();
      expect(iText.selected).toBe(undefined);
      iText._mouseDownHandler({ e: { button: 0 }, alreadySelected: false });
      expect(iText.selected).toBe(false);
      iText._mouseDownHandler({ e: {}, alreadySelected: true });
      expect(iText.selected).toBe(true);
    });
  });
});

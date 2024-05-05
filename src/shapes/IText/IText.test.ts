import { Canvas } from '../../canvas/Canvas';
import '../../../jest.extend';
import { Group } from '../Group';
import { IText } from './IText';

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
        const canvas = new Canvas();
        canvas.setZoom(zoom);
        jest.replaceProperty(text, 'canvas', canvas);
        const spy = jest.spyOn(canvas.getTopContext(), 'fillRect');

        text.renderCursorAt(canvas.getTopContext(), 1);
        const [left, top, width, height] = spy.mock.calls[0];
        expect({ width, height }).toMatchSnapshot({
          cloneDeepWith: (value) =>
            typeof value === 'number' ? value.toFixed(3) : undefined,
        });
      }
    );
  });
});

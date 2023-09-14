import '../../../jest.extend';
import { Group } from '../Group';
import { IText } from './IText';

describe('IText', () => {
  test.each([
    { scale: 1, zoom: 1 },
    { scale: 1, zoom: 50 },
    { scale: 200, zoom: 1 },
    { scale: 200, zoom: 50 },
    { scale: 200, zoom: 1 / 200 },
  ])(
    'cursor width under a group scaled by $scale and canvas zoomed by $zoom',
    ({ scale, zoom }) => {
      const text = new IText('testing', { cursorWidth: 100 });
      const group = new Group([text]);
      group.set({ scaleX: scale, scaleY: scale });
      group.setCoords();
      const fillRect = jest.fn();
      const getZoom = jest.fn().mockReturnValue(zoom);
      const mockContext = { fillRect };
      const mockCanvas = { contextTop: mockContext, getZoom };
      jest.replaceProperty(text, 'canvas', mockCanvas);

      text.renderCursorAt(1);
      expect(fillRect.mock.calls).toMatchSnapshot({
        cloneDeepWith: (value) =>
          typeof value === 'number' ? Math.round(value * 10) / 10 : undefined,
      });
    }
  );
});

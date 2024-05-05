import { Canvas } from '../../canvas/Canvas';
import '../../../jest.extend';
import { Group } from '../Group';
import { IText } from './IText';
import { getFabricDocument } from '../../env';

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

  it.only('firing up on a selected text in a group should NOT enter editing', () => {
    const text = new IText('test');
    const canvas = new Canvas();
    canvas.add(text);

    jest.spyOn(text, 'initDelayedCursor').mockImplementation(() => {});
    jest.spyOn(text, 'renderCursorOrSelection').mockImplementation(() => {});
    jest.spyOn(text, 'toJSON').mockReturnValue('text');
    const spy = jest.fn();
    canvas.on('mouse:up', spy);

    const fireClick = () => {
      canvas
        .getSelectionElement()
        .dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1 }));
      getFabricDocument().dispatchEvent(
        new MouseEvent('mouseup', { clientX: 1, clientY: 1 })
      );
    };

    const group = new Group([], { subTargetCheck: false });
    jest.spyOn(group, 'toJSON').mockReturnValue('group');

    expect(text.isEditing).toBe(false);

    fireClick();
    text.selected = true;
    text.__lastSelected = true;
    fireClick();
    expect(text.isEditing).toBe(true);

    canvas.remove(text);
    group.add(text);
    canvas.add(group);
    fireClick();
    expect(text.isEditing).toBe(false);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ target: group })
    );

    canvas.remove(group);
    group.remove(text);
    canvas.add(text);
    fireClick();
    expect(text.isEditing).toBe(true);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ target: text }));
  });
});

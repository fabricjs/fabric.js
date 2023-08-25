import { IText, iMatrix } from '../../../fabric';
import type { TMat2D } from '../../typedefs';
import { Canvas } from '../Canvas';

describe('Canvas event data', () => {
  let canvas: Canvas;
  let spy: jest.SpyInstance;
  beforeEach(() => {
    canvas = new Canvas(null);
    spy = jest.spyOn(canvas, 'fire');
  });

  afterEach(() => {
    return canvas.dispose();
  });

  test.each(
    (
      [
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'dblclick',
        'wheel',
        'contextmenu',
      ] as (keyof WindowEventMap)[]
    )
      .map(
        (type) =>
          [
            [type, iMatrix],
            [type, [2, Math.PI, 0, 0.5, 50, 50] as TMat2D],
          ] as const
      )
      .flat()
  )(
    'HTML event "%s" should fire a corresponding canvas event with viewportTransform of %s',
    (type, viewportTransform) => {
      viewportTransform && canvas.setViewportTransform(viewportTransform);
      canvas
        .getSelectionElement()
        .dispatchEvent(new MouseEvent(type, { clientX: 50, clientY: 50 }));
      expect(spy.mock.calls).toMatchSnapshot();
    }
  );

  test.each(
    (
      [
        'drag',
        'dragend',
        'dragenter',
        'dragleave',
        'dragover',
        'drop',
      ] as (keyof WindowEventMap)[]
    )
      .map(
        (type) =>
          [
            [type, iMatrix],
            [type, [2, Math.PI, 0, 0.5, 50, 50] as TMat2D],
          ] as const
      )
      .flat()
  )(
    'HTML event "%s" should fire a corresponding canvas event with viewportTransform of %s',
    (type, viewportTransform) => {
      viewportTransform && canvas.setViewportTransform(viewportTransform);
      // select target and mock some essentials for events to fire
      const dragTarget = new IText('Drag Target', {
        originX: 'center',
        originY: 'center',
      });
      jest.spyOn(dragTarget, 'onDragStart').mockReturnValue(true);
      jest.spyOn(dragTarget, 'renderDragSourceEffect').mockImplementation();
      jest.spyOn(dragTarget, 'toJSON').mockReturnValue('Drag Target');
      canvas.add(dragTarget);
      canvas.setActiveObject(dragTarget);
      spy.mockReset();
      canvas.getSelectionElement().dispatchEvent(
        new MouseEvent('dragstart', {
          clientX: 50,
          clientY: 50,
        })
      );
      canvas.getSelectionElement().dispatchEvent(
        new MouseEvent(type, {
          clientX: 50,
          clientY: 50,
        })
      );
      expect(spy.mock.calls).toMatchSnapshot();
    }
  );
});

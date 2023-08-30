/* eslint-disable no-restricted-globals */
import '../../../jest.extend';
import { Point } from '../../Point';
import { iMatrix } from '../../constants';
import { IText } from '../../shapes/IText/IText';
import type { TMat2D } from '../../typedefs';
import { Canvas } from '../Canvas';

describe('Canvas event data', () => {
  let canvas: Canvas;
  let spy: jest.SpyInstance;

  const snapshotOptions = {
    cloneDeepWith: (value: any) => {
      if (value instanceof Point) {
        return new Point(Math.round(value.x), Math.round(value.y));
      }
    },
  };

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
        'dblclick',
        'wheel',
        'contextmenu',
      ] as (keyof WindowEventMap)[]
    )
      .map(
        (type) =>
          [
            [type, undefined],
            [type, [2, Math.PI, 0, 0.5, 0, 0] as TMat2D],
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
      expect(spy.mock.calls).toMatchSnapshot(snapshotOptions);
    }
  );

  // must call mousedown for mouseup to be listened to
  test.each([[undefined], [[2, Math.PI, 0, 0.5, 50, 50] as TMat2D]] as const)(
    'HTML event "mouseup" should fire a corresponding canvas event with viewportTransform of %s',
    (viewportTransform) => {
      viewportTransform && canvas.setViewportTransform(viewportTransform);
      canvas
        .getSelectionElement()
        .dispatchEvent(
          new MouseEvent('mousedown', { clientX: 50, clientY: 50 })
        );
      spy.mockReset();
      document.dispatchEvent(
        new MouseEvent('mouseup', { clientX: 50, clientY: 50 })
      );
      expect(spy.mock.calls).toMatchSnapshot(snapshotOptions);
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
      expect(spy.mock.calls).toMatchSnapshot(snapshotOptions);
    }
  );
});

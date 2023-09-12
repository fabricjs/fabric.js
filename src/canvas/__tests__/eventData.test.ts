/* eslint-disable no-restricted-globals */
import '../../../jest.extend';
import { Point } from '../../Point';
import { IText } from '../../shapes/IText/IText';
import type { TMat2D } from '../../typedefs';
import { Canvas } from '../Canvas';

const genericVpt = [2.3, 0, 0, 2.3, 120, 80] as TMat2D;

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

  test.each([
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'dblclick',
    'wheel',
    'contextmenu',
  ] as (keyof WindowEventMap)[])(
    'HTML event "%s" should fire a corresponding canvas event with viewportTransform of %s',
    (type) => {
      canvas.setViewportTransform(genericVpt);
      canvas
        .getSelectionElement()
        .dispatchEvent(new MouseEvent(type, { clientX: 50, clientY: 50 }));
      expect(spy.mock.calls).toMatchSnapshot(snapshotOptions);
    }
  );

  // must call mousedown for mouseup to be listened to
  test('HTML event "mouseup" should fire a corresponding canvas event with viewportTransform of %s', () => {
    canvas.setViewportTransform(genericVpt);
    canvas
      .getSelectionElement()
      .dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));
    spy.mockReset();
    document.dispatchEvent(
      new MouseEvent('mouseup', { clientX: 50, clientY: 50 })
    );
    expect(spy.mock.calls).toMatchSnapshot(snapshotOptions);
  });

  test.each([
    'drag',
    'dragend',
    'dragenter',
    'dragleave',
    'dragover',
    'drop',
  ] as (keyof WindowEventMap)[])(
    'HTML event "%s" should fire a corresponding canvas event with viewportTransform of %s',
    (type) => {
      canvas.setViewportTransform(genericVpt);
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

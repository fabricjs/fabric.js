/* eslint-disable no-restricted-globals */
import '../../../jest.extend';
import type { TPointerEvent } from '../../EventTypeDefs';
import { Point } from '../../Point';
import { Group } from '../../shapes/Group';
import { IText } from '../../shapes/IText/IText';
import { FabricObject } from '../../shapes/Object/FabricObject';
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
    canvas = new Canvas();
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

it('A selected subtarget should not fire an event twice', () => {
  const target = new FabricObject();
  const group = new Group([target], {
    subTargetCheck: true,
    interactive: true,
  });
  const canvas = new Canvas();
  canvas.add(group);
  const targetSpy = jest.fn();
  target.on('mousedown', targetSpy);
  jest.spyOn(canvas, '_checkTarget').mockReturnValue(true);
  canvas.__onMouseDown({
    target: canvas.getSelectionElement(),
    clientX: 0,
    clientY: 0,
  } as unknown as TPointerEvent);
  expect(targetSpy).toHaveBeenCalledTimes(1);
});

it('should fire mouse over/out events on target', () => {
  const target = new FabricObject({ width: 10, height: 10 });
  const canvas = new Canvas();
  canvas.add(target);

  jest.spyOn(target, 'toJSON').mockReturnValue('target');

  const targetSpy = jest.spyOn(target, 'fire');
  const canvasSpy = jest.spyOn(canvas, 'fire');
  const enter = new MouseEvent('mousemove', { clientX: 5, clientY: 5 });
  const exit = new MouseEvent('mousemove', { clientX: 20, clientY: 20 });
  canvas._onMouseMove(enter);
  canvas._onMouseMove(exit);
  expect(targetSpy.mock.calls).toMatchSnapshot();
  expect(canvasSpy.mock.calls).toMatchSnapshot();
});

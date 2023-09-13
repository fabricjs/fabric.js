/* eslint-disable no-restricted-globals */
import '../../../jest.extend';
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
    'HTML event "%s" should fire a corresponding canvas event',
    (type) => {
      canvas.setViewportTransform(genericVpt);
      canvas
        .getSelectionElement()
        .dispatchEvent(new MouseEvent(type, { clientX: 50, clientY: 50 }));
      expect(spy.mock.calls).toMatchSnapshot(snapshotOptions);
    }
  );

  // must call mousedown for mouseup to be listened to
  test('HTML event "mouseup" should fire a corresponding canvas event', () => {
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
    'HTML event "%s" should fire a corresponding canvas event',
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

describe('Event targets', () => {
  it('A selected subtarget should not fire an event twice', () => {
    const target = new FabricObject();
    const group = new Group([target], {
      subTargetCheck: true,
      interactive: true,
    });
    const canvas = new Canvas(null);
    canvas.add(group);
    const targetSpy = jest.fn();
    target.on('mousedown', targetSpy);
    jest.spyOn(canvas, '_checkTarget').mockReturnValue(true);
    canvas.getSelectionElement().dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
      })
    );
    expect(targetSpy).toHaveBeenCalledTimes(1);
  });

  test('searchPossibleTargets', () => {
    const subTarget = new FabricObject();
    const target = new Group([subTarget], {
      subTargetCheck: true,
    });
    const parent = new Group([target], {
      subTargetCheck: true,
      interactive: true,
    });
    const canvas = new Canvas(null);
    canvas.add(parent);
    const targetSpy = jest.fn();
    target.on('mousedown', targetSpy);
    jest.spyOn(canvas, '_checkTarget').mockReturnValue(true);
    const found = canvas.searchPossibleTargets([parent], new Point());
    expect(found).toBe(target);
    expect(canvas.targets).toEqual([subTarget, target, parent]);
  });
});

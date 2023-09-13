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

  test('mouseover and mouseout with subTargetCheck', () => {
    const rect1 = new FabricObject({
      width: 5,
      height: 5,
      left: 5,
      top: 0,
      strokeWidth: 0,
    });
    const rect2 = new FabricObject({
      width: 5,
      height: 5,
      left: 5,
      top: 5,
      strokeWidth: 0,
    });
    const rect3 = new FabricObject({
      width: 5,
      height: 5,
      left: 0,
      top: 5,
      strokeWidth: 0,
    });
    const rect4 = new FabricObject({
      width: 5,
      height: 5,
      left: 0,
      top: 0,
      strokeWidth: 0,
    });
    const rect5 = new FabricObject({
      width: 5,
      height: 5,
      left: 2.5,
      top: 2.5,
      strokeWidth: 0,
    });
    const group1 = new Group([rect1, rect2], {
      subTargetCheck: true,
    });
    const group2 = new Group([rect3, rect4], {
      subTargetCheck: true,
    });
    // a group with 2 groups, with 2 rects each, one group left one group right
    // each with 2 rects vertically aligned
    const group = new Group([group1, group2], {
      subTargetCheck: true,
    });

    const enter = jest.fn();
    const exit = jest.fn();

    const getTargetsFromEventStream = (mock: jest.Mock) =>
      mock.mock.calls.map((args) => args[0].target);

    Object.entries({
      rect1,
      rect2,
      rect3,
      rect4,
      rect5,
      group1,
      group2,
      group,
    }).forEach(([key, object]) => {
      jest.spyOn(object, 'toJSON').mockReturnValue(key);
      object.on('mouseover', enter);
      object.on('mouseout', exit);
    });

    const canvas = new Canvas();
    canvas.add(group, rect5);

    const fire = (x: number, y: number) => {
      enter.mockClear();
      exit.mockClear();
      canvas
        .getSelectionElement()
        .dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
    };

    fire(1, 1);
    expect(getTargetsFromEventStream(enter)).toEqual([group, rect4, group2]);
    expect(getTargetsFromEventStream(exit)).toEqual([]);

    fire(5, 5);
    expect(getTargetsFromEventStream(enter)).toEqual([rect5]);
    expect(getTargetsFromEventStream(exit)).toEqual([group, rect4, group2]);

    fire(9, 9);
    expect(getTargetsFromEventStream(enter)).toEqual([group, rect2, group1]);
    expect(getTargetsFromEventStream(exit)).toEqual([rect5]);

    fire(9, 1);
    expect(getTargetsFromEventStream(enter)).toEqual([rect1]);
    expect(getTargetsFromEventStream(exit)).toEqual([rect2]);
  });
});

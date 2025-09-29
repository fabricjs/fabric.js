/* eslint-disable no-restricted-globals */
import type { TPointerEvent } from '../../EventTypeDefs';
import { Point } from '../../Point';
import { ActiveSelection } from '../../shapes/ActiveSelection';
import { Circle } from '../../shapes/Circle';
import { Group } from '../../shapes/Group';
import { IText } from '../../shapes/IText/IText';
import { FabricObject } from '../../shapes/Object/FabricObject';
import { Rect } from '../../shapes/Rect';
import { Triangle } from '../../shapes/Triangle';
import type { TMat2D } from '../../typedefs';
import { Canvas } from '../Canvas';

import { describe, expect, test, vi, beforeEach, afterEach, it } from 'vitest';
import type { MockInstance } from 'vitest';

const genericVpt = [2.3, 0, 0, 2.3, 120, 80] as TMat2D;

const registerTestObjects = (objects: Record<string, FabricObject>) => {
  Object.entries(objects).forEach(([key, object]) => {
    object.toJSON = vi.fn(() => key);
  });
};

describe('Canvas event data', () => {
  let canvas: Canvas;
  let spyFire: MockInstance;

  const snapshotOptions = {
    cloneDeepWith: (value: any) => {
      if (value instanceof Point) {
        return new Point(Math.round(value.x), Math.round(value.y));
      }
    },
  };

  beforeEach(() => {
    canvas = new Canvas();
    spyFire = vi.spyOn(canvas, 'fire');
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
      canvas.getSelectionElement().dispatchEvent(
        new MouseEvent(type, {
          clientX: 50,
          clientY: 50,
          detail: type === 'dblclick' ? 2 : undefined,
        }),
      );
      expect(spyFire.mock.calls).toMatchSnapshot(snapshotOptions);
    },
  );

  // must call mousedown for mouseup to be listened to
  test('HTML event "mouseup" should fire a corresponding canvas event', () => {
    canvas.setViewportTransform(genericVpt);
    canvas
      .getSelectionElement()
      .dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));
    spyFire.mockReset();
    document.dispatchEvent(
      new MouseEvent('mouseup', { clientX: 50, clientY: 50 }),
    );
    expect(spyFire.mock.calls).toMatchSnapshot(snapshotOptions);
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
      const dragTarget = new IText('Drag Target');
      vi.spyOn(dragTarget, 'onDragStart').mockReturnValue(true);
      vi.spyOn(dragTarget, 'renderDragSourceEffect').mockImplementation(
        vi.fn(),
      );
      dragTarget.toJSON = vi.fn(() => 'Drag Target');
      canvas.add(dragTarget);
      canvas.setActiveObject(dragTarget);
      spyFire.mockReset();
      const evt = new MouseEvent('dragstart', {
        clientX: 50,
        clientY: 50,
      });
      canvas._cacheTransformEventData(evt);
      canvas.getSelectionElement().dispatchEvent(evt);
      canvas.getSelectionElement().dispatchEvent(
        new MouseEvent(type, {
          clientX: 50,
          clientY: 50,
        }),
      );
      expect(spyFire.mock.calls).toMatchSnapshot(snapshotOptions);
    },
  );

  test('getScenePoint', () => {
    const canvas = new Canvas(undefined, {
      enableRetinaScaling: true,
      width: 200,
      height: 200,
    });
    vi.spyOn(canvas, 'getRetinaScaling').mockReturnValue(200);
    const spy = vi.spyOn(canvas, '_getPointerImpl');
    vi.spyOn(canvas.upperCanvasEl, 'getBoundingClientRect').mockReturnValue({
      width: 500,
      height: 500,
    });
    vi.spyOn(canvas.upperCanvasEl, 'width', 'get').mockReturnValue(200);
    vi.spyOn(canvas.upperCanvasEl, 'height', 'get').mockReturnValue(200);
    const ev = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
    });
    const point = canvas.getScenePoint(ev);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, ev);
    canvas._cacheTransformEventData(ev);
    expect(point).toEqual(canvas['_scenePoint']);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, ev, true);
  });
});

describe('Event targets', () => {
  it('A selected subtarget should not fire an event twice', () => {
    const target = new FabricObject();
    const group = new Group([target], {
      subTargetCheck: true,
      interactive: true,
    });
    const canvas = new Canvas();
    canvas.add(group);
    const targetSpy = vi.fn();
    target.on('mousedown', targetSpy);
    vi.spyOn(canvas, '_checkTarget').mockReturnValue(true);
    canvas.getSelectionElement().dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
      }),
    );
    expect(targetSpy).toHaveBeenCalledTimes(1);
  });

  test('mouseover and mouseout with subTargetCheck', () => {
    const rect1 = new FabricObject({
      width: 5,
      height: 5,
      left: 7.5,
      top: 2.5,
      strokeWidth: 0,
    });
    const rect2 = new FabricObject({
      width: 5,
      height: 5,
      left: 7.5,
      top: 7.5,
      strokeWidth: 0,
    });
    const rect3 = new FabricObject({
      width: 5,
      height: 5,
      left: 2.5,
      top: 7.5,
      strokeWidth: 0,
    });
    const rect4 = new FabricObject({
      width: 5,
      height: 5,
      left: 2.5,
      top: 2.5,
      strokeWidth: 0,
    });
    const rect5 = new FabricObject({
      width: 5,
      height: 5,
      left: 5,
      top: 5,
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

    const enter = vi.fn();
    const exit = vi.fn();

    const getTargetsFromEventStream = (mock: MockInstance) =>
      mock.mock.calls.map((args) => args[0].target);

    registerTestObjects({
      rect1,
      rect2,
      rect3,
      rect4,
      rect5,
      group1,
      group2,
      group,
    });

    Object.values({
      rect1,
      rect2,
      rect3,
      rect4,
      rect5,
      group1,
      group2,
      group,
    }).forEach((object) => {
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

  describe('findTarget', () => {
    test.skip.each([true, false])(
      'findTargetsTraversal: search all is %s',
      (searchAll) => {
        const subTarget1 = new FabricObject();
        const target1 = new Group([subTarget1], {
          subTargetCheck: true,
          interactive: true,
        });
        const subTarget2 = new FabricObject();
        const target2 = new Group([subTarget2], {
          subTargetCheck: true,
        });
        const parent = new Group([target1, target2], {
          subTargetCheck: true,
          interactive: true,
        });
        registerTestObjects({
          subTarget1,
          target1,
          subTarget2,
          target2,
          parent,
        });

        const canvas = new Canvas();
        canvas.add(parent);

        vi.spyOn(canvas, '_checkTarget').mockReturnValue(true);
        const found = canvas['findTargetsTraversal']([parent], new Point(), {
          searchStrategy: searchAll ? 'search-all' : 'first-hit',
        });
        expect(found).toEqual(
          searchAll
            ? [subTarget2, target2, subTarget1, target1, parent]
            : [subTarget2, target2, parent],
        );
      },
    );

    test.fails('searchPossibleTargets', () => {
      const subTarget = new FabricObject();
      const target = new Group([subTarget], {
        subTargetCheck: true,
      });
      const parent = new Group([target], {
        subTargetCheck: true,
        interactive: true,
      });
      registerTestObjects({ subTarget, target, parent });

      const canvas = new Canvas();
      canvas.add(parent);

      vi.spyOn(canvas, '_checkTarget').mockReturnValue(true);
      const found = canvas.searchPossibleTargets([parent], new Point());
      expect(found).toBe(target);
      expect(canvas.targets).toEqual([subTarget, target, parent]);
    });

    test('searchPossibleTargets with selection', () => {
      const subTarget = new FabricObject();
      const target = new Group([subTarget], {
        subTargetCheck: true,
      });
      const other = new FabricObject();
      const activeSelection = new ActiveSelection();
      registerTestObjects({ subTarget, target, other, activeSelection });

      const canvas = new Canvas(undefined, { activeSelection });
      canvas.add(other, target);
      activeSelection.add(target, other);
      canvas.setActiveObject(activeSelection);

      vi.spyOn(canvas, '_checkTarget').mockReturnValue(true);
      const found = canvas.searchPossibleTargets(
        [activeSelection],
        new Point(0, 0),
      );
      expect(found.target).toBe(activeSelection);
      expect(found.subTargets).toEqual([]);
    });

    test('findTarget preserveObjectStacking false', () => {
      const rect = new FabricObject({
        left: 5,
        top: 5,
        width: 10,
        height: 10,
        controls: {},
      });
      const rectOver = new FabricObject({
        left: 5,
        top: 5,
        width: 10,
        height: 10,
        controls: {},
      });
      registerTestObjects({ rect, rectOver });

      const canvas = new Canvas(undefined, { preserveObjectStacking: false });
      canvas.add(rect, rectOver);
      canvas.setActiveObject(rect);

      expect(
        canvas.findTarget({ clientX: 5, clientY: 5 } as TPointerEvent),
      ).toMatchObject({
        target: rect,
        subTargets: [],
      });
    });

    test('findTarget preserveObjectStacking true', () => {
      const rect = new FabricObject({
        left: 15,
        top: 15,
        width: 30,
        height: 30,
      });
      const rectOver = new FabricObject({
        left: 15,
        top: 15,
        width: 30,
        height: 30,
      });
      registerTestObjects({ rect, rectOver });

      const canvas = new Canvas(undefined, { preserveObjectStacking: true });
      canvas.add(rect, rectOver);

      const e = {
        clientX: 15,
        clientY: 15,
        shiftKey: true,
      } as TPointerEvent;
      const e2 = { clientX: 4, clientY: 4 };

      expect(canvas.findTarget(e)).toMatchObject(
        { target: rectOver, subTargets: [] },
        // 'Should return the rectOver, rect is not considered'
      );

      canvas.setActiveObject(rect);
      expect(canvas.findTarget(e)).toMatchObject(
        { target: rectOver, subTargets: [] },
        // 'Should still return rectOver because is above active object'
      );

      expect(canvas.findTarget(e2 as TPointerEvent)).toMatchObject(
        { target: rect, subTargets: [] },
        // 'Should rect because a corner of the activeObject has been hit'
      );

      canvas.altSelectionKey = 'shiftKey';
      expect(canvas.findTarget(e)).toMatchObject(
        { target: rect, subTargets: [] },
        // 'Should rect because active and altSelectionKey is pressed'
      );
    });

    test('findTarget with subTargetCheck', () => {
      const canvas = new Canvas();
      const rect = new FabricObject({ left: 0, top: 0, width: 10, height: 10 });
      const rect2 = new FabricObject({
        left: 30,
        top: 30,
        width: 10,
        height: 10,
      });
      const group = new Group([rect, rect2]);
      registerTestObjects({ rect, rect2, group });
      canvas.add(group);

      expect(
        canvas.findTarget({ clientX: 5, clientY: 5 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [],
      });

      expect(
        canvas.findTarget({ clientX: 35, clientY: 35 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [],
      });

      group.subTargetCheck = true;
      group.setCoords();

      expect(
        canvas.findTarget({ clientX: 5, clientY: 5 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [rect],
      });

      expect(
        canvas.findTarget({ clientX: 15, clientY: 15 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [],
      });

      expect(
        canvas.findTarget({ clientX: 35, clientY: 35 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [rect2],
      });
    });

    test('findTarget with subTargetCheck and canvas zoom', () => {
      const nested1 = new FabricObject({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: 'yellow',
      });
      const nested2 = new FabricObject({
        width: 100,
        height: 100,
        left: 150,
        top: 150,
        fill: 'purple',
      });
      const nestedGroup = new Group([nested1, nested2], {
        scaleX: 0.5,
        scaleY: 0.5,
        subTargetCheck: true,
      });
      nestedGroup.setPositionByOrigin(new Point(0, 100), 'left', 'top');
      const rect1 = new FabricObject({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: 'red',
      });
      const rect2 = new FabricObject({
        width: 100,
        height: 100,
        left: 150,
        top: 150,
        fill: 'blue',
      });
      const group = new Group([rect1, rect2, nestedGroup], {
        subTargetCheck: true,
      });
      group.setPositionByOrigin(new Point(-50, -150), 'left', 'top');

      registerTestObjects({
        rect1,
        rect2,
        nested1,
        nested2,
        nestedGroup,
        group,
      });

      const canvas = new Canvas(undefined, {
        viewportTransform: [0.1, 0, 0, 0.1, 100, 200],
      });
      canvas.add(group);

      expect(
        canvas.findTarget({ clientX: 96, clientY: 186 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [rect1],
      });

      expect(
        canvas.findTarget({ clientX: 98, clientY: 188 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [rect1],
      });

      expect(
        canvas.findTarget({ clientX: 100, clientY: 190 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [rect1],
      });

      expect(
        canvas.findTarget({ clientX: 102, clientY: 192 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [rect1],
      });

      expect(
        canvas.findTarget({ clientX: 104, clientY: 194 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [rect1],
      });

      expect(
        canvas.findTarget({ clientX: 106, clientY: 196 } as TPointerEvent),
      ).toMatchObject({
        target: group,
        subTargets: [rect2],
      });
    });

    test.each([true, false])(
      'findTarget on activeObject with subTargetCheck and preserveObjectStacking %s',
      (preserveObjectStacking) => {
        const rect = new FabricObject({
          left: 5,
          top: 5,
          width: 10,
          height: 10,
        });
        const rect2 = new FabricObject({
          left: 35,
          top: 35,
          width: 10,
          height: 10,
        });
        const group = new Group([rect, rect2], { subTargetCheck: true });
        registerTestObjects({ rect, rect2, group });

        const canvas = new Canvas(undefined, { preserveObjectStacking });
        canvas.add(group);
        canvas.setActiveObject(group);

        expect(
          canvas.findTarget({ clientX: 9, clientY: 9 } as TPointerEvent),
        ).toMatchObject({
          target: group,
          subTargets: [rect],
        });
      },
    );

    test('findTarget with perPixelTargetFind', () => {
      const triangle = new Triangle({ width: 30, height: 30 });
      registerTestObjects({ triangle });

      const canvas = new Canvas();
      canvas.add(triangle);

      expect(
        canvas.findTarget({ clientX: 5, clientY: 5 } as TPointerEvent),
      ).toMatchObject({
        target: triangle,
        subTargets: [],
      });

      canvas.perPixelTargetFind = true;

      expect(
        canvas.findTarget({ clientX: 5, clientY: 5 } as TPointerEvent),
      ).toMatchObject({
        subTargets: [],
      });
      expect(
        canvas.findTarget({ clientX: 15, clientY: 15 } as TPointerEvent),
      ).toMatchObject({
        target: triangle,
        subTargets: [],
      });
    });

    describe('findTarget with perPixelTargetFind in nested group', () => {
      const prepareTest = () => {
        const deepTriangle = new Triangle({
          left: 15,
          top: 15,
          width: 30,
          height: 30,
          fill: 'yellow',
        });
        const triangle2 = new Triangle({
          width: 30,
          height: 30,
          angle: 100,
          fill: 'pink',
        });
        triangle2.setPositionByOrigin(new Point(100, 120), 'left', 'top');
        const deepCircle = new Circle({
          radius: 30,
          top: 30,
          left: 60,
          fill: 'blue',
        });
        const circle2 = new Circle({
          scaleX: 2,
          scaleY: 2,
          radius: 10,
          fill: 'purple',
        });
        circle2.setPositionByOrigin(new Point(-20, 120), 'left', 'top');

        const deepRect = new Rect({
          width: 50,
          height: 30,
          fill: 'red',
          skewX: 40,
          skewY: 20,
        });
        deepRect.setPositionByOrigin(new Point(110, 10), 'left', 'top');

        const rect2 = new Rect({
          width: 100,
          height: 80,
          top: 90,
          left: 110,
          fill: 'green',
        });
        const deepGroup = new Group([deepTriangle, deepCircle, deepRect], {
          subTargetCheck: true,
        });
        const group2 = new Group([deepGroup, circle2, rect2, triangle2], {
          subTargetCheck: true,
        });
        const group3 = new Group([group2], { subTargetCheck: true });

        registerTestObjects({
          deepTriangle,
          triangle2,
          deepCircle,
          circle2,
          rect2,
          deepRect,
          deepGroup,
          group2,
          group3,
        });

        const canvas = new Canvas(undefined, { perPixelTargetFind: true });
        canvas.add(group3);

        return {
          canvas,
          deepTriangle,
          triangle2,
          deepCircle,
          circle2,
          rect2,
          deepRect,
          deepGroup,
          group2,
          group3,
        };
      };

      test.each([
        { x: 5, y: 5 },
        { x: 21, y: 9 },
        { x: 37, y: 7 },
        { x: 89, y: 47 },
        { x: 16, y: 122 },
        { x: 127, y: 37 },
        { x: 87, y: 139 },
      ])('transparent hit on %s', ({ x: clientX, y: clientY }) => {
        const { canvas } = prepareTest();
        expect(
          canvas.findTarget({ clientX, clientY } as TPointerEvent),
        ).toMatchObject({
          subTargets: [],
        });
      });

      test('findTarget with perPixelTargetFind in nested group', () => {
        const {
          canvas,
          deepTriangle,
          triangle2,
          deepCircle,
          circle2,
          rect2,
          deepRect,
          deepGroup,
          group2,
          group3,
        } = prepareTest();

        expect(
          canvas.findTarget({ clientX: 15, clientY: 15 } as TPointerEvent),
        ).toMatchObject({
          target: group3,
          subTargets: [deepTriangle, deepGroup, group2],
        });

        expect(
          canvas.findTarget({ clientX: 50, clientY: 20 } as TPointerEvent),
        ).toMatchObject({
          target: group3,
          subTargets: [deepCircle, deepGroup, group2],
        });

        expect(
          canvas.findTarget({ clientX: 117, clientY: 16 } as TPointerEvent),
        ).toMatchObject({
          target: group3,
          subTargets: [deepRect, deepGroup, group2],
        });

        expect(
          canvas.findTarget({ clientX: 100, clientY: 90 } as TPointerEvent),
        ).toMatchObject({
          target: group3,
          subTargets: [rect2, group2],
        });

        expect(
          canvas.findTarget({ clientX: 9, clientY: 145 } as TPointerEvent),
        ).toMatchObject({
          target: group3,
          subTargets: [circle2, group2],
        });

        expect(
          canvas.findTarget({ clientX: 66, clientY: 143 } as TPointerEvent),
        ).toMatchObject({
          target: group3,
          subTargets: [triangle2, group2],
        });
      });
    });

    test('findTarget on active selection', () => {
      const rect1 = new FabricObject({
        left: 6,
        top: 6,
        width: 10,
        height: 10,
      });
      const rect2 = new FabricObject({
        left: 25,
        top: 25,
        width: 10,
        height: 10,
      });
      const rect3 = new FabricObject({
        left: 25,
        top: 5,
        width: 10,
        height: 10,
      });
      const activeSelection = new ActiveSelection([rect1, rect2], {
        subTargetCheck: true,
        cornerSize: 2,
      });
      registerTestObjects({ rect1, rect2, rect3, activeSelection });

      const canvas = new Canvas(undefined, { activeSelection });
      canvas.add(rect1, rect2, rect3);
      canvas.setActiveObject(activeSelection);

      expect(
        canvas.findTarget({ clientX: 5, clientY: 5 } as TPointerEvent),
      ).toMatchObject({
        target: activeSelection,
        subTargets: [rect1],
      });

      expect(
        canvas.findTarget({ clientX: 40, clientY: 15 } as TPointerEvent),
      ).toMatchObject({
        subTargets: [],
      });
      expect(activeSelection.__corner).toBeUndefined();

      expect(
        canvas.findTarget({ clientX: 1, clientY: 1 } as TPointerEvent),
      ).toMatchObject({
        target: activeSelection,
        subTargets: [rect1],
      });
      expect(activeSelection.__corner).toBe('tl');

      expect(
        canvas.findTarget({ clientX: 0, clientY: 0 } as TPointerEvent),
      ).toMatchObject({
        target: activeSelection,
        subTargets: [],
      });
      expect(activeSelection.__corner).toBe('tl');

      expect(
        canvas.findTarget({ clientX: 25, clientY: 5 } as TPointerEvent),
      ).toMatchObject(
        {
          target: activeSelection,
          subTargets: [],
        },
        // 'Should not return the rect behind active selection'
      );

      canvas.discardActiveObject();
      expect(
        canvas.findTarget({ clientX: 25, clientY: 5 } as TPointerEvent),
      ).toMatchObject(
        {
          target: rect3,
          subTargets: [],
        },
        // 'Should return the rect after clearing selection'
      );
    });

    test('findTarget on active selection with perPixelTargetFind', () => {
      const rect1 = new Rect({
        left: 5,
        top: 5,
        width: 10,
        height: 10,
      });
      const rect2 = new Rect({
        left: 25,
        top: 25,
        width: 10,
        height: 10,
      });
      const activeSelection = new ActiveSelection([rect1, rect2]);
      registerTestObjects({ rect1, rect2, activeSelection });

      const canvas = new Canvas(undefined, {
        activeSelection,
        perPixelTargetFind: true,
        preserveObjectStacking: true,
      });
      canvas.add(rect1, rect2);
      canvas.setActiveObject(activeSelection);

      expect(
        canvas.findTarget({ clientX: 8, clientY: 8 } as TPointerEvent),
      ).toMatchObject({
        target: activeSelection,
        subTargets: [],
      });

      expect(
        canvas.findTarget({ clientX: 15, clientY: 15 } as TPointerEvent),
      ).toMatchObject({
        currentSubTargets: [],
        subTargets: [],
      });
    });
  });

  it('should fire mouse over/out events on target', () => {
    const target = new FabricObject({ width: 10, height: 10 });
    const canvas = new Canvas();
    canvas.add(target);
    target.toJSON = vi.fn(() => 'target');
    const targetSpy = vi.spyOn(target, 'fire');
    const canvasSpy = vi.spyOn(canvas, 'fire');
    const enter = new MouseEvent('mousemove', { clientX: 5, clientY: 5 });
    const exit = new MouseEvent('mousemove', { clientX: 20, clientY: 20 });
    canvas._onMouseMove(enter);
    canvas._onMouseMove(exit);
    expect(targetSpy.mock.calls).toMatchSnapshot();
    expect(canvasSpy.mock.calls).toMatchSnapshot();
  });
});

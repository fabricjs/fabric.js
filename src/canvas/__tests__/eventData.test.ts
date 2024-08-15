/* eslint-disable no-restricted-globals */
import '../../../jest.extend';
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

const genericVpt = [2.3, 0, 0, 2.3, 120, 80] as TMat2D;

const registerTestObjects = (objects: Record<string, FabricObject>) => {
  Object.entries(objects).forEach(([key, object]) => {
    jest.spyOn(object, 'toJSON').mockReturnValue(key);
  });
};

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
    'HTML event "%s" should fire a corresponding canvas event',
    (type) => {
      canvas.setViewportTransform(genericVpt);
      canvas
        .getSelectionElement()
        .dispatchEvent(new MouseEvent(type, { clientX: 50, clientY: 50 }));
      expect(spy.mock.calls).toMatchSnapshot(snapshotOptions);
    },
  );

  // must call mousedown for mouseup to be listened to
  test('HTML event "mouseup" should fire a corresponding canvas event', () => {
    canvas.setViewportTransform(genericVpt);
    canvas
      .getSelectionElement()
      .dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));
    spy.mockReset();
    document.dispatchEvent(
      new MouseEvent('mouseup', { clientX: 50, clientY: 50 }),
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
        }),
      );
      canvas.getSelectionElement().dispatchEvent(
        new MouseEvent(type, {
          clientX: 50,
          clientY: 50,
        }),
      );
      expect(spy.mock.calls).toMatchSnapshot(snapshotOptions);
    },
  );

  test('getScenePoint', () => {
    const canvas = new Canvas(undefined, {
      enableRetinaScaling: true,
      width: 200,
      height: 200,
    });
    jest.spyOn(canvas, 'getRetinaScaling').mockReturnValue(200);
    const spy = jest.spyOn(canvas, 'getPointer');
    jest.spyOn(canvas.upperCanvasEl, 'getBoundingClientRect').mockReturnValue({
      width: 500,
      height: 500,
    });
    jest.spyOn(canvas.upperCanvasEl, 'width', 'get').mockReturnValue(200);
    jest.spyOn(canvas.upperCanvasEl, 'height', 'get').mockReturnValue(200);
    const ev = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
    });
    const point = canvas.getScenePoint(ev);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, ev);
    canvas._cacheTransformEventData(ev);
    expect(point).toEqual(canvas['_absolutePointer']);
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
    const targetSpy = jest.fn();
    target.on('mousedown', targetSpy);
    jest.spyOn(canvas, '_checkTarget').mockReturnValue(true);
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
    const mockEvent = ({
      canvas,
      ...init
    }: MouseEventInit & { canvas: Canvas }) => {
      const e = new MouseEvent('mousedown', {
        ...init,
      });
      jest
        .spyOn(e, 'target', 'get')
        .mockReturnValue(canvas.getSelectionElement());
      return e;
    };

    const findTarget = (canvas: Canvas, ev?: MouseEventInit) => {
      const target = canvas.findTarget(
        mockEvent({ canvas, clientX: 0, clientY: 0, ...ev }),
      );
      const targets = canvas.targets;
      canvas.targets = [];
      return { target, targets };
    };

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

        jest.spyOn(canvas, '_checkTarget').mockReturnValue(true);
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

    test.failing('searchPossibleTargets', () => {
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

      jest.spyOn(canvas, '_checkTarget').mockReturnValue(true);
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

      jest.spyOn(canvas, '_checkTarget').mockReturnValue(true);
      const found = canvas.searchPossibleTargets(
        [activeSelection],
        new Point(),
      );
      expect(found).toBe(activeSelection);
      expect(canvas.targets).toEqual([]);
    });

    test('findTarget clears prev targets', () => {
      const canvas = new Canvas();
      canvas.targets = [new FabricObject()];
      expect(findTarget(canvas, { clientX: 0, clientY: 0 })).toEqual({
        target: undefined,
        targets: [],
      });
    });

    test('findTarget preserveObjectStacking false', () => {
      const rect = new FabricObject({
        left: 0,
        top: 0,
        width: 10,
        height: 10,
        controls: {},
      });
      const rectOver = new FabricObject({
        left: 0,
        top: 0,
        width: 10,
        height: 10,
        controls: {},
      });
      registerTestObjects({ rect, rectOver });

      const canvas = new Canvas(undefined, { preserveObjectStacking: false });
      canvas.add(rect, rectOver);
      canvas.setActiveObject(rect);

      expect(findTarget(canvas, { clientX: 5, clientY: 5 })).toEqual({
        target: rect,
        targets: [],
      });
    });

    test('findTarget preserveObjectStacking true', () => {
      const rect = new FabricObject({ left: 0, top: 0, width: 30, height: 30 });
      const rectOver = new FabricObject({
        left: 0,
        top: 0,
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
      };
      const e2 = { clientX: 4, clientY: 4 };

      expect(findTarget(canvas, e)).toEqual(
        { target: rectOver, targets: [] },
        // 'Should return the rectOver, rect is not considered'
      );

      canvas.setActiveObject(rect);
      expect(findTarget(canvas, e)).toEqual(
        { target: rectOver, targets: [] },
        // 'Should still return rectOver because is above active object'
      );

      expect(findTarget(canvas, e2)).toEqual(
        { target: rect, targets: [] },
        // 'Should rect because a corner of the activeObject has been hit'
      );

      canvas.altSelectionKey = 'shiftKey';
      expect(findTarget(canvas, e)).toEqual(
        { target: rect, targets: [] },
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

      expect(findTarget(canvas, { clientX: 5, clientY: 5 })).toEqual({
        target: group,
        targets: [],
      });

      expect(findTarget(canvas, { clientX: 35, clientY: 35 })).toEqual({
        target: group,
        targets: [],
      });

      group.subTargetCheck = true;
      group.setCoords();

      expect(findTarget(canvas, { clientX: 5, clientY: 5 })).toEqual({
        target: group,
        targets: [rect],
      });

      expect(findTarget(canvas, { clientX: 15, clientY: 15 })).toEqual({
        target: group,
        targets: [],
      });

      expect(findTarget(canvas, { clientX: 35, clientY: 35 })).toEqual({
        target: group,
        targets: [rect2],
      });
    });

    test('findTarget with subTargetCheck and canvas zoom', () => {
      const nested1 = new FabricObject({
        width: 100,
        height: 100,
        fill: 'yellow',
      });
      const nested2 = new FabricObject({
        width: 100,
        height: 100,
        left: 100,
        top: 100,
        fill: 'purple',
      });
      const nestedGroup = new Group([nested1, nested2], {
        scaleX: 0.5,
        scaleY: 0.5,
        top: 100,
        left: 0,
        subTargetCheck: true,
      });
      const rect1 = new FabricObject({
        width: 100,
        height: 100,
        fill: 'red',
      });
      const rect2 = new FabricObject({
        width: 100,
        height: 100,
        left: 100,
        top: 100,
        fill: 'blue',
      });
      const group = new Group([rect1, rect2, nestedGroup], {
        top: -150,
        left: -50,
        subTargetCheck: true,
      });
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

      expect(findTarget(canvas, { clientX: 96, clientY: 186 })).toEqual({
        target: group,
        targets: [rect1],
      });

      expect(findTarget(canvas, { clientX: 98, clientY: 188 })).toEqual({
        target: group,
        targets: [rect1],
      });

      expect(findTarget(canvas, { clientX: 100, clientY: 190 })).toEqual({
        target: group,
        targets: [rect1],
      });

      expect(findTarget(canvas, { clientX: 102, clientY: 192 })).toEqual({
        target: group,
        targets: [rect1],
      });

      expect(findTarget(canvas, { clientX: 104, clientY: 194 })).toEqual({
        target: group,
        targets: [rect1],
      });

      expect(findTarget(canvas, { clientX: 106, clientY: 196 })).toEqual({
        target: group,
        targets: [rect2],
      });
    });

    test.each([true, false])(
      'findTarget on activeObject with subTargetCheck and preserveObjectStacking %s',
      (preserveObjectStacking) => {
        const rect = new FabricObject({
          left: 0,
          top: 0,
          width: 10,
          height: 10,
        });
        const rect2 = new FabricObject({
          left: 30,
          top: 30,
          width: 10,
          height: 10,
        });
        const group = new Group([rect, rect2], { subTargetCheck: true });
        registerTestObjects({ rect, rect2, group });

        const canvas = new Canvas(undefined, { preserveObjectStacking });
        canvas.add(group);
        canvas.setActiveObject(group);

        expect(findTarget(canvas, { clientX: 9, clientY: 9 })).toEqual({
          target: group,
          targets: [rect],
        });
      },
    );

    test('findTarget with perPixelTargetFind', () => {
      const triangle = new Triangle({ width: 30, height: 30 });
      registerTestObjects({ triangle });

      const canvas = new Canvas();
      canvas.add(triangle);

      expect(findTarget(canvas, { clientX: 5, clientY: 5 })).toEqual({
        target: triangle,
        targets: [],
      });

      canvas.perPixelTargetFind = true;

      expect(findTarget(canvas, { clientX: 5, clientY: 5 })).toEqual({
        target: undefined,
        targets: [],
      });
      expect(findTarget(canvas, { clientX: 15, clientY: 15 })).toEqual({
        target: triangle,
        targets: [],
      });
    });

    describe('findTarget with perPixelTargetFind in nested group', () => {
      const prepareTest = () => {
        const deepTriangle = new Triangle({
          left: 0,
          top: 0,
          width: 30,
          height: 30,
          fill: 'yellow',
        });
        const triangle2 = new Triangle({
          left: 100,
          top: 120,
          width: 30,
          height: 30,
          angle: 100,
          fill: 'pink',
        });
        const deepCircle = new Circle({
          radius: 30,
          top: 0,
          left: 30,
          fill: 'blue',
        });
        const circle2 = new Circle({
          scaleX: 2,
          scaleY: 2,
          radius: 10,
          top: 120,
          left: -20,
          fill: 'purple',
        });
        const deepRect = new Rect({
          width: 50,
          height: 30,
          top: 10,
          left: 110,
          fill: 'red',
          skewX: 40,
          skewY: 20,
        });
        const rect2 = new Rect({
          width: 100,
          height: 80,
          top: 50,
          left: 60,
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
        expect(findTarget(canvas, { clientX, clientY })).toEqual({
          target: undefined,
          targets: [],
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

        expect(findTarget(canvas, { clientX: 15, clientY: 15 })).toEqual({
          target: group3,
          targets: [deepTriangle, deepGroup, group2],
        });

        expect(findTarget(canvas, { clientX: 50, clientY: 20 })).toEqual({
          target: group3,
          targets: [deepCircle, deepGroup, group2],
        });

        expect(findTarget(canvas, { clientX: 117, clientY: 16 })).toEqual({
          target: group3,
          targets: [deepRect, deepGroup, group2],
        });

        expect(findTarget(canvas, { clientX: 100, clientY: 90 })).toEqual({
          target: group3,
          targets: [rect2, group2],
        });

        expect(findTarget(canvas, { clientX: 9, clientY: 145 })).toEqual({
          target: group3,
          targets: [circle2, group2],
        });

        expect(findTarget(canvas, { clientX: 66, clientY: 143 })).toEqual({
          target: group3,
          targets: [triangle2, group2],
        });
      });
    });

    test('findTarget on active selection', () => {
      const rect1 = new FabricObject({
        left: 0,
        top: 0,
        width: 10,
        height: 10,
      });
      const rect2 = new FabricObject({
        left: 20,
        top: 20,
        width: 10,
        height: 10,
      });
      const rect3 = new FabricObject({
        left: 20,
        top: 0,
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

      expect(findTarget(canvas, { clientX: 5, clientY: 5 })).toEqual({
        target: activeSelection,
        targets: [rect1],
      });

      expect(findTarget(canvas, { clientX: 40, clientY: 15 })).toEqual({
        target: undefined,
        targets: [],
      });
      expect(activeSelection.__corner).toBeUndefined();

      expect(findTarget(canvas, { clientX: 0, clientY: 0 })).toEqual({
        target: activeSelection,
        targets: [],
      });
      expect(activeSelection.__corner).toBe('tl');

      expect(findTarget(canvas, { clientX: 25, clientY: 5 })).toEqual(
        {
          target: activeSelection,
          targets: [],
        },
        // 'Should not return the rect behind active selection'
      );

      canvas.discardActiveObject();
      expect(findTarget(canvas, { clientX: 25, clientY: 5 })).toEqual(
        {
          target: rect3,
          targets: [],
        },
        // 'Should return the rect after clearing selection'
      );
    });

    test('findTarget on active selection with perPixelTargetFind', () => {
      const rect1 = new Rect({
        left: 0,
        top: 0,
        width: 10,
        height: 10,
      });
      const rect2 = new Rect({
        left: 20,
        top: 20,
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

      expect(findTarget(canvas, { clientX: 8, clientY: 8 })).toEqual({
        target: activeSelection,
        targets: [],
      });

      expect(findTarget(canvas, { clientX: 15, clientY: 15 })).toEqual({
        target: undefined,
        targets: [],
      });
    });
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
});

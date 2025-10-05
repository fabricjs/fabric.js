import {
  FixedLayout,
  LayoutManager,
  ClipPathLayout,
  FitContentLayout,
} from '../LayoutManager';
import { Canvas } from '../canvas/Canvas';
import { Group } from './Group';
import type { GroupProps } from './Group';
import { Rect } from './Rect';
import { FabricObject } from './Object/FabricObject';
import { FabricImage } from './Image';
import { SignalAbortedError } from '../util/internals/console';

import { describe, expect, it, test, vi, afterEach } from 'vitest';
import { StaticCanvas } from '../canvas/StaticCanvas';
import { FabricText, Point, version } from '../../fabric';
import { isTransparent } from '../util';

const makeGenericGroup = (options?: Partial<GroupProps>) => {
  const objs = [new FabricObject(), new FabricObject()];
  const group = new Group(objs, options);
  return {
    group,
    originalObjs: objs,
  };
};

function makeGroupWith2Objects() {
  const rect1 = new Rect({
      top: 105,
      left: 115,
      width: 30,
      height: 10,
      strokeWidth: 0,
    }),
    rect2 = new Rect({
      top: 140,
      left: 55,
      width: 10,
      height: 40,
      strokeWidth: 0,
    });

  return new Group([rect1, rect2], { strokeWidth: 0 });
}

function makeGroupWith2ObjectsWithOpacity() {
  const g = makeGroupWith2Objects();
  const objs = g.getObjects();
  objs[0].opacity = 0.5;
  objs[1].opacity = 0.8;
  return g;
}

function makeGroupWith2ObjectsAndNoExport() {
  const g = makeGroupWith2Objects();
  const objs = g.getObjects();
  objs[1].excludeFromExport = true;
  return g;
}

function makeGroupWith4Objects() {
  const rect1 = new Rect({ top: 105, left: 115, width: 30, height: 10 }),
    rect2 = new Rect({ top: 140, left: 55, width: 10, height: 40 }),
    rect3 = new Rect({ top: 60, left: 10, width: 20, height: 40 }),
    rect4 = new Rect({ top: 95, left: 95, width: 40, height: 40 });

  return new Group([rect1, rect2, rect3, rect4]);
}

describe('Group', () => {
  it('avoid mutations to passed objects array', () => {
    const { group, originalObjs } = makeGenericGroup();

    group.add(new FabricObject());

    expect(group._objects).not.toBe(originalObjs);
    expect(originalObjs).toHaveLength(2);
    expect(group._objects).toHaveLength(3);
  });

  it('fromObject restores values as they are, ignoring specific width/height/top/left that could come from layout', async () => {
    const objectData = {
      width: 2,
      height: 3,
      left: 7,
      top: 5.5,
      strokeWidth: 0,
      objects: [
        new Rect({
          width: 100,
          height: 100,
          top: 50,
          left: 50,
          strokeWidth: 0,
        }).toObject(),
      ],
    };

    const group = await Group.fromObject(objectData);
    expect(group.width).toBe(objectData.width);
    expect(group.height).toBe(objectData.height);
    expect(group.left).toBe(objectData.left);
    expect(group.top).toBe(objectData.top);
    group.triggerLayout();
    expect(group.width).toBe(100);
    expect(group.height).toBe(100);
  });

  it('fromObject with images', async () => {
    const objs = [
      new FabricObject(),
      new FabricObject(),
      new FabricImage(new Image()),
    ];
    const group = new Group(objs);
    const jsonData = group.toObject();
    const abortController = new AbortController();
    abortController.abort();
    return Group.fromObject(jsonData, {
      signal: abortController.signal,
    }).catch((e) => {
      expect(e instanceof SignalAbortedError).toBe(true);
      expect(e.message).toBe(
        `fabric: loadImage 'options.signal' is in 'aborted' state`,
      );
    });
  });

  describe('With fit-content layout manager', () => {
    test('will serialize correctly without default values', async () => {
      const { group } = makeGenericGroup({
        clipPath: new Rect({ width: 30, height: 30 }),
        layoutManager: new LayoutManager(new FitContentLayout()),
        includeDefaultValues: false,
      });
      const serialized = group.toObject();
      expect(serialized.layoutManager).toBe(undefined);
    });
    it('Group initialization will calculate correct width/height ignoring passed width and height', async () => {
      const objectOptions = {
        width: 2,
        height: 3,
        left: 6,
        top: 4,
        strokeWidth: 0,
      };

      const group = new Group(
        [
          new Rect({
            width: 100,
            height: 100,
            top: 0,
            left: 0,
            strokeWidth: 0,
          }),
        ],
        objectOptions,
      );
      expect(group.width).toBe(100);
      expect(group.height).toBe(100);
    });
    it('Group initialization will calculate width/height ignoring the passed one', async () => {
      const objectOptions = {
        width: 2,
        height: 3,
        left: 6,
        top: 4,
        strokeWidth: 0,
      };

      const group = new Group(
        [
          new Rect({
            width: 100,
            height: 100,
            top: 0,
            left: 0,
            strokeWidth: 0,
          }),
        ],
        objectOptions,
      );
      expect(group.left).toBe(6);
      expect(group.top).toBe(4);
    });
    it('Group initialization will calculate size and position if nothing is passed', async () => {
      const objectOptions = {
        strokeWidth: 0,
      };

      const group = new Group(
        [
          new Rect({
            width: 100,
            height: 100,
            top: 50,
            left: 60,
            strokeWidth: 0,
          }),
        ],
        objectOptions,
      );
      expect(group.left).toBe(60);
      expect(group.top).toBe(50);
      expect(group.width).toBe(100);
      expect(group.height).toBe(100);
    });
    test('fit-content layout will change position or size', async () => {
      const { group } = makeGenericGroup({
        top: 30,
        left: 10,
        width: 40,
        height: 50,
      });
      expect(group.top).toBe(30);
      expect(group.left).toBe(10);
      expect(group.width).toBe(1);
      expect(group.height).toBe(1);
      group.add(new Rect({ width: 1000, height: 1500, top: -500, left: -400 }));
      // group position and size will not change
      expect(group.top).toBe(-500);
      expect(group.left).toBe(-400);
      expect(group.width).toBe(1001);
      expect(group.height).toBe(1501);
    });
  });

  describe('With fixed layout', () => {
    test('will serialize and deserialize correctly', async () => {
      const { group } = makeGenericGroup({
        width: 40,
        height: 50,
        layoutManager: new LayoutManager(new FixedLayout()),
      });
      const serialized = group.toObject();
      expect(serialized.layoutManager).toMatchObject({
        type: 'layoutManager',
        strategy: 'fixed',
      });
      const restoredGroup = await Group.fromObject(serialized);
      expect(restoredGroup.layoutManager).toBeInstanceOf(LayoutManager);
      expect(restoredGroup.layoutManager.strategy).toBeInstanceOf(FixedLayout);
    });
    test('will serialize correctly without default values', async () => {
      const { group } = makeGenericGroup({
        width: 40,
        height: 50,
        layoutManager: new LayoutManager(new FixedLayout()),
        includeDefaultValues: false,
      });
      const serialized = group.toObject();
      expect(serialized.layoutManager).toMatchObject({
        type: 'layoutManager',
        strategy: 'fixed',
      });
    });
    test('Fixed layout will not change position or size', async () => {
      const { group } = makeGenericGroup({
        top: 30,
        left: 10,
        width: 40,
        height: 50,
        layoutManager: new LayoutManager(new FixedLayout()),
      });
      expect(group.top).toBe(30);
      expect(group.left).toBe(10);
      expect(group.width).toBe(40);
      expect(group.height).toBe(50);
      group.add(new Rect({ width: 1000, height: 1000, top: -500, left: -500 }));
      // group position and size will not change
      expect(group.top).toBe(30);
      expect(group.left).toBe(10);
      expect(group.width).toBe(40);
      expect(group.height).toBe(50);
    });
  });

  describe('With clip-path layout', () => {
    test('will serialize and deserialize correctly', async () => {
      const { group } = makeGenericGroup({
        clipPath: new Rect({ width: 30, height: 30 }),
        layoutManager: new LayoutManager(new ClipPathLayout()),
      });
      const serialized = group.toObject();
      expect(serialized.layoutManager).toMatchObject({
        type: 'layoutManager',
        strategy: 'clip-path',
      });
      const restoredGroup = await Group.fromObject(serialized);
      expect(restoredGroup.layoutManager).toBeInstanceOf(LayoutManager);
      expect(restoredGroup.layoutManager.strategy).toBeInstanceOf(
        ClipPathLayout,
      );
    });
    test('will serialize correctly without default values', async () => {
      const { group } = makeGenericGroup({
        clipPath: new Rect({ width: 30, height: 30 }),
        layoutManager: new LayoutManager(new ClipPathLayout()),
        includeDefaultValues: false,
      });
      const serialized = group.toObject();
      expect(serialized.layoutManager).toMatchObject({
        type: 'layoutManager',
        strategy: 'clip-path',
      });
    });
    test('clip-path layout will not change position or size', async () => {
      const { group } = makeGenericGroup({
        top: 20,
        left: 40,
        clipPath: new Rect({ width: 30, height: 10 }),
        layoutManager: new LayoutManager(new ClipPathLayout()),
      });
      expect(group.top).toBe(20);
      expect(group.left).toBe(40);
      // TODO BUG: this should be 30
      expect(group.width).toBe(31);
      expect(group.height).toBe(11);
      group.add(new Rect({ width: 1000, height: 1000, top: -500, left: -500 }));
      // group position and size will not change
      expect(group.top).toBe(20);
      expect(group.left).toBe(40);
      // TODO BUG: this should be 30
      expect(group.width).toBe(31);
      expect(group.height).toBe(11);
    });
  });

  it('triggerLayout should preform layout, layoutManager is defined', () => {
    const group = new Group();
    expect(group.layoutManager).toBeDefined();
    const performLayout = vi.spyOn(group.layoutManager, 'performLayout');

    group.triggerLayout();
    const fixedLayout = new FixedLayout();
    group.triggerLayout({ strategy: fixedLayout });
    expect(performLayout).toHaveBeenCalledTimes(2);
    expect(performLayout).toHaveBeenNthCalledWith(1, {
      target: group,
      type: 'imperative',
    });
    expect(performLayout).toHaveBeenNthCalledWith(2, {
      strategy: fixedLayout,
      target: group,
      type: 'imperative',
    });
  });
  test('adding and removing an object', () => {
    const object = new FabricObject();
    const group = new Group([object]);
    const group2 = new Group();
    const canvas = new Canvas();

    const eventsSpy = vi.spyOn(object, 'fire');
    const removeSpy = vi.spyOn(group, 'remove');
    const exitSpy = vi.spyOn(group, 'exitGroup');
    const enterSpy = vi.spyOn(group2, 'enterGroup');

    expect(object.group).toBe(group);
    expect(object.parent).toBe(group);
    expect(object.canvas).toBeUndefined();

    canvas.add(group, group2);
    expect(object.canvas).toBe(canvas);

    group2.add(object);
    expect(object.group).toBe(group2);
    expect(object.parent).toBe(group2);
    expect(object.canvas).toBe(canvas);
    expect(removeSpy).toBeCalledWith(object);
    expect(exitSpy).toBeCalledWith(object, undefined);
    expect(enterSpy).toBeCalledWith(object, true);
    expect(eventsSpy).toHaveBeenNthCalledWith(1, 'removed', { target: group });
    expect(eventsSpy).toHaveBeenNthCalledWith(2, 'added', { target: group2 });

    group2.remove(object);
    expect(eventsSpy).toHaveBeenNthCalledWith(3, 'removed', { target: group2 });
    expect(object.group).toBeUndefined();
    expect(object.parent).toBeUndefined();
    expect(object.canvas).toBeUndefined();

    expect(eventsSpy).toBeCalledTimes(3);
  });

  const canvas = new StaticCanvas(undefined, {
    enableRetinaScaling: false,
    width: 600,
    height: 600,
  });

  afterEach(() => {
    canvas.clear();
    canvas.backgroundColor = Canvas.getDefaults().backgroundColor;
    canvas.calcOffset();
  });

  it('constructor', () => {
    const group = makeGroupWith2Objects();

    expect(group).toBeTruthy();
    expect(group, 'should be instance of Group').toBeInstanceOf(Group);
  });

  it('toString', () => {
    const group = makeGroupWith2Objects();
    expect(group.toString(), 'should return proper representation').toBe(
      '#<Group: (2)>',
    );
  });

  it('getObjects', () => {
    const rect1 = new Rect(),
      rect2 = new Rect();

    const group = new Group([rect1, rect2]);

    expect(group.getObjects).toBeTypeOf('function');
    expect(
      Array.isArray(group.getObjects()),
      'should be an array',
    ).toBeTruthy();
    expect(group.getObjects().length, 'should have 2 items').toBe(2);
    expect(
      group.getObjects(),
      'should return deepEqual objects as those passed to constructor',
    ).toEqual([rect1, rect2]);
  });

  it('add', () => {
    const group = makeGroupWith2Objects();
    const rect1 = new Rect(),
      rect2 = new Rect(),
      rect3 = new Rect();

    expect(group.add).toBeTypeOf('function');
    group.add(rect1);
    expect(
      group.item(group.size() - 1),
      'last object should be newly added one',
    ).toBe(rect1);
    expect(group.getObjects().length, 'there should be 3 objects').toBe(3);

    group.add(rect2, rect3);
    expect(
      group.item(group.size() - 1),
      'last object should be last added one',
    ).toBe(rect3);
    expect(group.size(), 'there should be 5 objects').toBe(5);
  });

  it('remove', () => {
    const rect1 = new Rect(),
      rect2 = new Rect(),
      rect3 = new Rect(),
      group = new Group([rect1, rect2, rect3]);

    let fired = false;
    const targets: FabricObject[] = [];

    expect(group.remove).toBeTypeOf('function');
    expect(rect1.group, 'group should be referenced').toBe(group);
    expect(rect1.parent, 'parent should be referenced').toBe(group);

    group.on('object:removed', (opt) => {
      targets.push(opt.target);
    });

    rect1.on('removed', (opt) => {
      expect(opt.target, 'group should not be referenced').toBe(group);
      expect(rect1.group, 'group should not be referenced').toBe(undefined);
      expect(rect1.parent, 'parent should not be referenced').toBe(undefined);
      fired = true;
    });

    const removed = group.remove(rect2);
    expect(removed, 'should return removed objects').toEqual([rect2]);
    expect(group.getObjects(), 'should remove object properly').toEqual([
      rect1,
      rect3,
    ]);

    const removed2 = group.remove(rect1, rect3);
    expect(removed2, 'should return removed objects').toEqual([rect1, rect3]);
    expect(group.isEmpty(), 'group should be empty').toBe(true);
    expect(fired, 'should have fired removed event on rect1').toBeTruthy();
    expect(targets, 'should contain removed objects').toEqual([
      rect2,
      rect1,
      rect3,
    ]);
  });

  it('size', () => {
    const group = makeGroupWith2Objects();

    expect(group.size).toBeTypeOf('function');
    expect(group.size()).toBe(2);
    group.add(new Rect());
    expect(group.size()).toBe(3);
    group.remove(group.getObjects()[0]);
    group.remove(group.getObjects()[0]);
    expect(group.size()).toBe(1);
  });

  it('set', () => {
    const group = makeGroupWith2Objects(),
      firstObject = group.getObjects()[0];

    expect(group.set).toBeTypeOf('function');

    group.set('opacity', 0.12345);
    expect(
      group.get('opacity'),
      'group\'s "own" property should be set properly',
    ).toBe(0.12345);
    expect(
      firstObject.get('opacity'),
      "objects' value of non delegated property should stay same",
    ).toBe(1);

    group.set('left', 1234);
    expect(
      group.get('left'),
      'group\'s own "left" property should be set properly',
    ).toBe(1234);
    expect(
      firstObject.get('left') !== 1234,
      "objects' value should not be affected",
    ).toBeTruthy();

    group.set({ left: 888, top: 999 });
    expect(
      group.get('left'),
      'group\'s own "left" property should be set properly via object',
    ).toBe(888);
    expect(
      group.get('top'),
      'group\'s own "top" property should be set properly via object',
    ).toBe(999);
  });

  it('contains', () => {
    const rect1 = new Rect(),
      rect2 = new Rect(),
      notIncludedRect = new Rect(),
      group = new Group([rect1, rect2]);

    expect(group.contains).toBeTypeOf('function');

    expect(group.contains(rect1), 'should contain first object').toBeTruthy();
    expect(group.contains(rect2), 'should contain second object').toBeTruthy();

    expect(
      group.contains(notIncludedRect),
      'should report not-included one properly',
    ).toBeFalsy();
  });

  it('toObject', () => {
    const group = makeGroupWith2Objects();

    expect(group.toObject).toBeTypeOf('function');

    const clone = group.toObject();

    const expectedObject = {
      version: version,
      type: 'Group',
      originX: 'center',
      originY: 'center',
      left: 90,
      top: 130,
      width: 80,
      height: 60,
      fill: 'rgb(0,0,0)',
      // layout: 'fit-content',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      shadow: null,
      visible: true,
      backgroundColor: '',
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      objects: clone.objects,
      strokeUniform: false,
      subTargetCheck: false,
      interactive: false,
      layoutManager: {
        type: 'layoutManager',
        strategy: 'fit-content',
      },
    };

    expect(clone).toEqual(expectedObject);

    expect(group, 'should produce different object').not.toBe(clone);
    expect(
      group.getObjects() !== clone.objects,
      'should produce different object array',
    ).toBeTruthy();
    expect(
      group.getObjects()[0] !== clone.objects[0],
      'should produce different objects in array',
    ).toBeTruthy();
  });

  it('toObject without default values', () => {
    const group = makeGroupWith2Objects();
    group.includeDefaultValues = false;
    const clone = group.toObject();
    const objects = [
      {
        version: version,
        type: 'Rect',
        left: 25,
        top: -25,
        width: 30,
        height: 10,
        strokeWidth: 0,
      },
      {
        version: version,
        type: 'Rect',
        left: -35,
        top: 10,
        width: 10,
        height: 40,
        strokeWidth: 0,
      },
    ];
    const expectedObject = {
      version: version,
      type: 'Group',
      left: 90,
      top: 130,
      width: 80,
      height: 60,
      objects: objects,
    };
    expect(clone).toEqual(expectedObject);
  });

  it('toObject with excludeFromExport set on an object', () => {
    const group = makeGroupWith2Objects();
    const group2 = makeGroupWith2ObjectsAndNoExport();
    const clone = group.toObject();
    const clone2 = group2.toObject();
    expect(clone2.objects).toEqual(
      group2._objects
        .filter((obj) => !obj.excludeFromExport)
        .map((obj) => obj.toObject()),
    );
    // @ts-expect-error -- deleting intentionally
    delete clone.objects;
    // @ts-expect-error -- deleting intentionally
    delete clone2.objects;
    expect(clone).toEqual(clone2);
  });

  it('render', () => {
    const group = makeGroupWith2Objects();
    expect(group.render).toBeTypeOf('function');
  });

  it('item', () => {
    const group = makeGroupWith2Objects();

    expect(group.item).toBeTypeOf('function');
    expect(group.item(0)).toBe(group.getObjects()[0]);
    expect(group.item(1)).toBe(group.getObjects()[1]);
    expect(group.item(9999)).toBe(undefined);
  });

  it('moveObjectTo', () => {
    const group = makeGroupWith4Objects(),
      groupEl1 = group.getObjects()[0],
      groupEl2 = group.getObjects()[1],
      groupEl3 = group.getObjects()[2],
      groupEl4 = group.getObjects()[3];

    // [ 1, 2, 3, 4 ]
    expect(group.item(0)).toBe(groupEl1);
    expect(group.item(1)).toBe(groupEl2);
    expect(group.item(2)).toBe(groupEl3);
    expect(group.item(3)).toBe(groupEl4);
    expect(group.item(9999)).toBe(undefined);

    group.moveObjectTo(group.item(0), 3);

    // moved 1 to level 3 — [2, 3, 4, 1]
    expect(group.item(3)).toBe(groupEl1);
    expect(group.item(0)).toBe(groupEl2);
    expect(group.item(1)).toBe(groupEl3);
    expect(group.item(2)).toBe(groupEl4);
    expect(group.item(9999)).toBe(undefined);

    group.moveObjectTo(group.item(0), 2);

    // moved 2 to level 2 — [3, 4, 2, 1]
    expect(group.item(3)).toBe(groupEl1);
    expect(group.item(2)).toBe(groupEl2);
    expect(group.item(0)).toBe(groupEl3);
    expect(group.item(1)).toBe(groupEl4);
    expect(group.item(9999)).toBe(undefined);
  });

  it('complexity', () => {
    const group = makeGroupWith2Objects();

    expect(group.complexity).toBeTypeOf('function');
    expect(group.complexity()).toBe(2);
  });

  it('removeAll', () => {
    const group = makeGroupWith2Objects(),
      firstObject = group.item(0),
      initialLeftValue = 115,
      initialTopValue = 105;

    expect(initialLeftValue !== firstObject.get('left')).toBeTruthy();
    expect(initialTopValue !== firstObject.get('top')).toBeTruthy();

    const objects = group.getObjects();
    expect(group.removeAll(), 'should remove all objects').toEqual(objects);
    expect(firstObject.get('left'), 'should restore initial left value').toBe(
      initialLeftValue,
    );
    expect(firstObject.get('top'), 'should restore initial top value').toBe(
      initialTopValue,
    );
  });

  it('containsPoint', () => {
    const group = makeGroupWith2Objects();
    group.set({ originX: 'center', originY: 'center' }).setCoords();

    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    expect(group.containsPoint).toBeTypeOf('function');

    expect(group.containsPoint(new Point(0, 0))).toBeFalsy();

    group.scale(2);
    expect(group.containsPoint(new Point(50, 120))).toBeTruthy();
    expect(group.containsPoint(new Point(100, 160))).toBeTruthy();
    expect(group.containsPoint(new Point(0, 0))).toBeFalsy();

    group.scale(1);
    group.padding = 30;
    group.setCoords();
    expect(group.containsPoint(new Point(50, 120))).toBeTruthy();
    expect(group.containsPoint(new Point(100, 170))).toBeFalsy();
    expect(group.containsPoint(new Point(0, 0))).toBeFalsy();
  });

  it('forEachObject', () => {
    const group = makeGroupWith2Objects();

    expect(group.forEachObject).toBeTypeOf('function');

    const iteratedObjects: FabricObject[] = [];
    group.forEachObject(function (groupObject) {
      iteratedObjects.push(groupObject);
    });

    expect(
      iteratedObjects[0],
      'iteration give back objects in same order',
    ).toBe(group.getObjects()[0]);
    expect(
      iteratedObjects[1],
      'iteration give back objects in same order',
    ).toBe(group.getObjects()[1]);
  });

  it('fromObject', async () => {
    const group = makeGroupWith2ObjectsWithOpacity();

    expect(Group.fromObject).toBeTypeOf('function');
    const groupObject = group.toObject();

    const newGroupFromObject = await Group.fromObject(groupObject);

    const objectFromOldGroup = group.toObject();
    const objectFromNewGroup = newGroupFromObject.toObject();

    expect(newGroupFromObject).toBeInstanceOf(Group);

    expect(objectFromOldGroup.objects[0]).toEqual(
      objectFromNewGroup.objects[0],
    );
    expect(objectFromOldGroup.objects[1]).toEqual(
      objectFromNewGroup.objects[1],
    );
    expect(objectFromOldGroup).toEqual(objectFromNewGroup);
  });

  it('fromObject with clipPath', async () => {
    const clipPath = new Rect({
      width: 500,
      height: 250,
      top: 0,
      left: 0,
      absolutePositioned: true,
    });

    const groupObject = new Group([
      new Rect({ width: 100, height: 100, fill: 'red' }),
      new Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
      new Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
      new Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 }),
    ]);
    groupObject.clipPath = clipPath;

    const groupToObject = groupObject.toObject();

    const newGroupFromObject = await Group.fromObject(groupToObject);
    const objectFromNewGroup = newGroupFromObject.toObject();

    expect(newGroupFromObject).toBeInstanceOf(Group);
    expect(
      newGroupFromObject.clipPath,
      'clipPath has been restored',
    ).toBeInstanceOf(Rect);
    expect(
      objectFromNewGroup,
      'double serialization gives same results',
    ).toEqual(groupToObject);
  });

  it('fromObject restores aCoords', async () => {
    const group = makeGroupWith2ObjectsWithOpacity();

    const groupObject = group.toObject();
    groupObject.subTargetCheck = true;

    const newGroupFromObject = await Group.fromObject(groupObject);
    expect(
      newGroupFromObject._objects[0].aCoords.tl,
      'acoords 0 are restored',
    ).toBeTruthy();
    expect(
      newGroupFromObject._objects[1].aCoords.tl,
      'acoords 1 are restored',
    ).toBeTruthy();
  });

  it('fromObject does not delete objects from source', async () => {
    const group = makeGroupWith2ObjectsWithOpacity();
    const groupObject = group.toObject();

    const newGroupFromObject = await Group.fromObject(groupObject);
    expect(
      // @ts-expect-error -- objects is not typed as part of the group instance
      newGroupFromObject.objects,
      'the objects array has not been pulled in',
    ).toBe(undefined);
    expect(
      groupObject.objects,
      'the objects array has not been deleted from object source',
    ).not.toBe(undefined);
  });

  it('toSVG', () => {
    const group = makeGroupWith2Objects();
    expect(group.toSVG).toBeTypeOf('function');
    const expectedSVG =
      '<g transform="matrix(1 0 0 1 90 130)"  >\n<g style=""   >\n\t\t<g transform="matrix(1 0 0 1 25 -25)"  >\n<rect style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x="-15" y="-5" rx="0" ry="0" width="30" height="10" />\n</g>\n\t\t<g transform="matrix(1 0 0 1 -35 10)"  >\n<rect style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x="-5" y="-20" rx="0" ry="0" width="10" height="40" />\n</g>\n</g>\n</g>\n';
    expect(group.toSVG()).toBe(expectedSVG);
  });

  it('toSVG with a clipPath', () => {
    const group = makeGroupWith2Objects();
    group.clipPath = new Rect({ width: 100, height: 100 });
    expect(group.toSVG()).toMatchSVGSnapshot();
  });

  it('toSVG with a clipPath absolutePositioned', () => {
    const group = makeGroupWith2Objects();
    group.clipPath = new Rect({ width: 100, height: 100 });
    group.clipPath.absolutePositioned = true;
    expect(group.toSVG()).toMatchSVGSnapshot();
  });

  it('toSVG with a group as a clipPath', () => {
    const group = makeGroupWith2Objects();
    group.clipPath = makeGroupWith2Objects();
    const expectedSVG =
      '<g transform="matrix(1 0 0 1 90 130)" clip-path="url(#CLIPPATH_0)"  >\n<clipPath id="CLIPPATH_0" >\n\t\t<rect transform="matrix(1 0 0 1 115 105)" x="-15" y="-5" rx="0" ry="0" width="30" height="10" />\n\t\t<rect transform="matrix(1 0 0 1 55 140)" x="-5" y="-20" rx="0" ry="0" width="10" height="40" />\n</clipPath>\n<g style=""   >\n\t\t<g transform="matrix(1 0 0 1 25 -25)"  >\n<rect style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x="-15" y="-5" rx="0" ry="0" width="30" height="10" />\n</g>\n\t\t<g transform="matrix(1 0 0 1 -35 10)"  >\n<rect style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x="-5" y="-20" rx="0" ry="0" width="10" height="40" />\n</g>\n</g>\n</g>\n';
    expect(group.toSVG()).toEqualSVG(expectedSVG);
  });

  it('cloning group with 2 objects', async () => {
    const group = makeGroupWith2Objects();
    const clone = await group.clone();

    expect(clone, 'should be different instance').not.toBe(group);
    expect(clone.toObject(), 'should have same properties').toEqual(
      group.toObject(),
    );
  });

  it('get with locked objects', () => {
    const group = makeGroupWith2Objects();

    expect(group.get('lockMovementX')).toBe(false);

    // TODO acitveGroup
    // group.getObjects()[0].lockMovementX = true;
    // expect(group.get('lockMovementX')).toBe(true);
    //
    // group.getObjects()[0].lockMovementX = false;
    // expect(group.get('lockMovementX')).toBe(false);

    group.set('lockMovementX', true);
    expect(group.get('lockMovementX')).toBe(true);

    // group.set('lockMovementX', false);
    // group.getObjects()[0].lockMovementY = true;
    // group.getObjects()[1].lockRotation = true;
    //
    // expect(group.get('lockMovementY')).toBe(true);
    // expect(group.get('lockRotation')).toBe(true);
  });

  it('object stacking methods with group objects', () => {
    const textBg = new Rect({
      fill: '#abc',
      width: 100,
      height: 100,
    });

    const text = new FabricText('text');
    const obj = new FabricObject();
    const group = new Group([textBg, text, obj]);

    expect(group.sendObjectToBack).toBeTypeOf('function');
    expect(group.bringObjectToFront).toBeTypeOf('function');
    expect(group.sendObjectBackwards).toBeTypeOf('function');
    expect(group.bringObjectForward).toBeTypeOf('function');
    expect(group.moveObjectTo).toBeTypeOf('function');

    canvas.add(group);

    expect(group.getObjects()).toEqual([textBg, text, obj]);

    group.dirty = false;
    group.bringObjectToFront(textBg);
    expect(group.getObjects()).toEqual([text, obj, textBg]);
    expect(group.dirty, 'should invalidate group').toBeTruthy();

    group.dirty = false;
    group.sendObjectToBack(textBg);
    expect(group.getObjects()).toEqual([textBg, text, obj]);
    expect(group.dirty, 'should invalidate group').toBeTruthy();

    group.dirty = false;
    group.bringObjectToFront(textBg);
    expect(group.getObjects()).toEqual([text, obj, textBg]);
    expect(group.dirty, 'should invalidate group').toBeTruthy();

    group.dirty = false;
    group.bringObjectToFront(textBg);
    expect(group.getObjects(), 'has no effect').toEqual([text, obj, textBg]);
    expect(group.dirty === false, 'should not invalidate group').toBeTruthy();

    group.dirty = false;
    group.sendObjectToBack(textBg);
    expect(group.getObjects()).toEqual([textBg, text, obj]);
    expect(group.dirty, 'should invalidate group').toBeTruthy();

    group.dirty = false;
    group.sendObjectToBack(textBg);
    expect(group.getObjects(), 'has no effect').toEqual([textBg, text, obj]);
    expect(group.dirty === false, 'should not invalidate group').toBeTruthy();

    group.dirty = false;
    group.sendObjectBackwards(obj);
    expect(group.getObjects()).toEqual([textBg, obj, text]);
    expect(group.dirty, 'should invalidate group').toBeTruthy();

    group.dirty = false;
    group.bringObjectForward(text);
    expect(group.getObjects(), 'has no effect').toEqual([textBg, obj, text]);
    expect(group.dirty === false, 'should not invalidate group').toBeTruthy();

    group.dirty = false;
    group.bringObjectForward(obj);
    expect(group.getObjects()).toEqual([textBg, text, obj]);
    expect(group.dirty, 'should invalidate group').toBeTruthy();

    group.dirty = false;
    group.bringObjectForward(textBg);
    expect(group.getObjects()).toEqual([text, textBg, obj]);
    expect(group.dirty, 'should invalidate group').toBeTruthy();

    group.dirty = false;
    group.moveObjectTo(obj, 2);
    expect(group.getObjects(), 'has no effect').toEqual([text, textBg, obj]);
    expect(group.dirty === false, 'should not invalidate group').toBeTruthy();

    group.dirty = false;
    group.moveObjectTo(obj, 0);
    expect(group.getObjects()).toEqual([obj, text, textBg]);
  });

  it('group reference on an object', () => {
    const group = makeGroupWith2Objects();
    const firstObjInGroup = group.getObjects()[0];
    const secondObjInGroup = group.getObjects()[1];

    expect(firstObjInGroup.group).toBe(group);
    expect(secondObjInGroup.group).toBe(group);
    expect(firstObjInGroup.parent).toBe(group);
    expect(secondObjInGroup.parent).toBe(group);

    group.remove(firstObjInGroup);
    expect(typeof firstObjInGroup.group, 'group should be undefined').toBe(
      'undefined',
    );
    expect(typeof firstObjInGroup.parent, 'parent should be undefined').toBe(
      'undefined',
    );
  });

  it('insertAt', () => {
    const rect1 = new Rect({ id: 1 }),
      rect2 = new Rect({ id: 2 }),
      rect3 = new Rect({ id: 3 }),
      rect4 = new Rect({ id: 4 }),
      rect5 = new Rect({ id: 5 }),
      rect6 = new Rect({ id: 6 }),
      rect7 = new Rect({ id: 7 }),
      rect8 = new Rect({ id: 8 }),
      group = new Group(),
      control: Rect[] = [],
      fired: Rect[] = [],
      firingControl: Rect[] = [];

    group.add(rect1, rect2);
    control.push(rect1, rect2);

    expect(group.insertAt, 'should respond to `insertAt` method').toBeTypeOf(
      'function',
    );

    function equalsControl(description: string) {
      expect(
        // @ts-expect-error -- id is not typed as part of the fabric object
        group.getObjects().map((o) => o.id),
        'should equal control array ' + description,
        // @ts-expect-error -- id is not typed as part of the fabric object
      ).toEqual(control.map((o) => o.id));
      expect(
        group.getObjects(),
        'should equal control array ' + description,
      ).toEqual(control);
      expect(
        // @ts-expect-error -- id is not typed as part of the fabric object
        fired.map((o) => o.id),
        'fired events should equal control array ' + description,
        // @ts-expect-error -- id is not typed as part of the fabric object
      ).toEqual(firingControl.map((o) => o.id));
      expect(
        fired,
        'fired events should equal control array ' + description,
      ).toEqual(firingControl);
    }

    expect(
      group._onObjectAdded,
      'has a standard _onObjectAdded method',
    ).toBeTypeOf('function');
    [rect1, rect2, rect3, rect4, rect5, rect6, rect7, rect8].forEach((obj) => {
      obj.on('added', (e) => {
        expect(e.target).toBe(group);
        fired.push(obj);
      });
    });

    group.insertAt(1, rect3);
    control.splice(1, 0, rect3);
    firingControl.push(rect3);
    equalsControl('rect3');
    group.insertAt(0, rect4);
    control.splice(0, 0, rect4);
    firingControl.push(rect4);
    equalsControl('rect4');
    group.insertAt(2, rect5);
    control.splice(2, 0, rect5);
    firingControl.push(rect5);
    equalsControl('rect5');
    group.insertAt(2, rect6);
    control.splice(2, 0, rect6);
    firingControl.push(rect6);
    equalsControl('rect6');
    group.insertAt(3, rect7, rect8);
    control.splice(3, 0, rect7, rect8);
    firingControl.push(rect7, rect8);
    equalsControl('rect7');
  });

  it('dirty flag propagation from children up', () => {
    const g1 = makeGroupWith4Objects();
    const obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = true;
    expect(g1.dirty, 'Group has no dirty flag set').toBe(false);
    obj.set('fill', 'red');
    expect(obj.dirty, 'Obj has dirty flag set').toBe(true);
    expect(g1.dirty, 'Group has dirty flag set').toBe(true);
  });

  it('dirty flag propagation from children up does not happen if value does not change really', () => {
    const g1 = makeGroupWith4Objects();
    const obj = g1.item(0);
    obj.fill = 'red';
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = true;
    expect(obj.dirty, 'Obj has no dirty flag set').toBe(false);
    expect(g1.dirty, 'Group has no dirty flag set').toBe(false);
    obj.set('fill', 'red');
    expect(obj.dirty, 'Obj has no dirty flag set').toBe(false);
    expect(g1.dirty, 'Group has no dirty flag set').toBe(false);
  });

  it('dirty flag propagation from children up with', () => {
    const g1 = makeGroupWith4Objects();
    const obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    // specify that the group is caching or the test will fail under node since the
    // object caching is disabled by default
    g1.ownCaching = true;
    expect(g1.dirty, 'Group has no dirty flag set').toBe(false);
    obj.set('angle', 5);
    expect(obj.dirty, 'Obj has dirty flag still false').toBe(false);
    expect(g1.dirty, 'Group has dirty flag set').toBe(true);
  });

  it('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas are influenced by group', () => {
    const g1 = makeGroupWith4Objects();
    const obj = g1.item(0);
    const dims = obj._getCacheCanvasDimensions();
    g1.scaleX = 2;
    const dims2 = obj._getCacheCanvasDimensions();
    expect(
      dims2.width - 2,
      'width of cache has increased with group scale',
    ).toBe((dims.width - 2) * g1.scaleX);
  });

  it('test group - pixels.', () => {
    const rect1 = new Rect({
        top: 2,
        left: 2,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect2 = new Rect({
        top: 6,
        left: 6,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      group = new Group([rect1, rect2], {
        opacity: 1,
        fill: '',
        strokeWidth: 0,
        objectCaching: false,
      }),
      ctx = canvas.contextContainer;

    canvas.add(group);
    canvas.renderAll();

    expect(canvas.enableRetinaScaling, 'enable retina scaling is off').toBe(
      false,
    );
    expect(isTransparent(ctx, 0, 0, 0), '0,0 is transparent').toBe(true);
    expect(isTransparent(ctx, 1, 1, 0), '1,1 is opaque').toBe(false);
    expect(isTransparent(ctx, 2, 2, 0), '2,2 is opaque').toBe(false);
    expect(isTransparent(ctx, 3, 3, 0), '3,3 is transparent').toBe(true);
    expect(isTransparent(ctx, 4, 4, 0), '4,4 is transparent').toBe(true);
    expect(isTransparent(ctx, 5, 5, 0), '5,5 is opaque').toBe(false);
    expect(isTransparent(ctx, 6, 6, 0), '6,6 is opaque').toBe(false);
    expect(isTransparent(ctx, 7, 7, 0), '7,7 is transparent').toBe(true);
  });

  it('group add', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      group = new Group([rect1], { layoutManager: new LayoutManager() });

    const coords = group.aCoords;
    group.add(rect2);
    const newCoords = group.aCoords;
    expect(coords, 'object coords have been recalculated - add').not.toBe(
      newCoords,
    );
  });

  it('group add edge cases', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      group = new Group([rect1]);

    //  duplicate
    expect(group.canEnterGroup(rect1)).toBeFalsy();
    group.add(rect1);
    expect(group.getObjects()).toEqual([rect1]);
    //  duplicate on same call
    expect(group.canEnterGroup(rect2)).toBeTruthy();
    group.add(rect2, rect2);
    expect(group.getObjects()).toEqual([rect1, rect2]);
    //  adding self
    expect(group.canEnterGroup(group)).toBeFalsy();
    group.insertAt(0, group);
    expect(group.getObjects()).toEqual([rect1, rect2]);
    //  nested object should be removed from group
    const nestedGroup = new Group([rect1]);
    expect(group.canEnterGroup(nestedGroup)).toBeTruthy();
    group.add(nestedGroup);
    expect(group.getObjects()).toEqual([rect2, nestedGroup]);
    //  circular group
    const circularGroup = new Group([group]);
    expect(
      group.canEnterGroup(circularGroup),
      'circular group should be denied entry',
    ).toBeFalsy();
    group.add(circularGroup);
    expect(group.getObjects(), 'objects should not have changed').toEqual([
      rect2,
      nestedGroup,
    ]);
  });

  it('group remove', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      group = new Group([rect1, rect2], { layoutManager: new LayoutManager() });

    const coords = group.aCoords;
    group.remove(rect2);
    const newCoords = group.aCoords;
    expect(coords, 'object coords have been recalculated - remove').not.toBe(
      newCoords,
    );
  });

  it('willDrawShadow', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect3 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect4 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      group = new Group([rect1, rect2]),
      group2 = new Group([rect3, rect4]),
      group3 = new Group([group, group2]);

    expect(
      group3.willDrawShadow(),
      'group will not cast shadow because objects do not have it',
    ).toBe(false);
    // @ts-expect-error -- partial shadow object
    group3.shadow = { offsetX: 1, offsetY: 2 };
    expect(
      group3.willDrawShadow(),
      'group will cast shadow because group itself has shadow',
    ).toBe(true);
    // @ts-expect-error -- deleting intentionally
    delete group3.shadow;
    // @ts-expect-error -- partial shadow object
    group2.shadow = { offsetX: 1, offsetY: 2 };
    expect(
      group3.willDrawShadow(),
      'group will cast shadow because inner group2 has shadow',
    ).toBe(true);
    // @ts-expect-error -- deleting intentionally
    delete group2.shadow;
    // @ts-expect-error -- partial shadow object
    rect1.shadow = { offsetX: 1, offsetY: 2 };
    expect(
      group3.willDrawShadow(),
      'group will cast shadow because inner rect1 has shadow',
    ).toBe(true);
    expect(
      group.willDrawShadow(),
      'group will cast shadow because inner rect1 has shadow',
    ).toBe(true);
    expect(
      group2.willDrawShadow(),
      'group will not cast shadow because no child has shadow',
    ).toBe(false);
  });

  it('willDrawShadow with no offsets', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect3 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      rect4 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: false,
      }),
      group = new Group([rect1, rect2]),
      group2 = new Group([rect3, rect4]),
      group3 = new Group([group, group2]);

    expect(
      group3.willDrawShadow(),
      'group will not cast shadow because objects do not have it',
    ).toBe(false);
    // @ts-expect-error -- partial shadow object
    group3.shadow = { offsetX: 0, offsetY: 0 };
    expect(
      group3.willDrawShadow(),
      'group will NOT cast shadow because group itself has shadow but not offsets',
    ).toBe(false);
    // @ts-expect-error -- partial shadow object
    group3.shadow = { offsetX: 2, offsetY: 0 };
    expect(
      group3.willDrawShadow(),
      'group will cast shadow because group itself has shadow and one offsetX different than 0',
    ).toBe(true);
    // @ts-expect-error -- partial shadow object
    group3.shadow = { offsetX: 0, offsetY: 2 };
    expect(
      group3.willDrawShadow(),
      'group will cast shadow because group itself has shadow and one offsetY different than 0',
    ).toBe(true);
    // @ts-expect-error -- partial shadow object
    group3.shadow = { offsetX: -2, offsetY: 0 };
    expect(
      group3.willDrawShadow(),
      'group will cast shadow because group itself has shadow and one offsetX different than 0',
    ).toBe(true);
    // @ts-expect-error -- partial shadow object
    group3.shadow = { offsetX: 0, offsetY: -2 };
    expect(
      group3.willDrawShadow(),
      'group will cast shadow because group itself has shadow and one offsetY different than 0',
    ).toBe(true);
    // @ts-expect-error -- partial shadow object
    rect1.shadow = { offsetX: 1, offsetY: 2 };
    // @ts-expect-error -- partial shadow object
    group3.shadow = { offsetX: 0, offsetY: 0 };
    expect(
      group3.willDrawShadow(),
      'group will cast shadow because group itself will not, but rect 1 will',
    ).toBe(true);
  });

  it('shouldCache', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      rect3 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      rect4 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      group = new Group([rect1, rect2], { objectCaching: true }),
      group2 = new Group([rect3, rect4], { objectCaching: true }),
      group3 = new Group([group, group2], { objectCaching: true });

    expect(
      group3.shouldCache(),
      'group3 will cache because no child has shadow',
    ).toBe(true);
    expect(
      group2.shouldCache(),
      'group2 will not cache because is drawing on parent group3 cache',
    ).toBe(false);
    expect(
      rect3.shouldCache(),
      'rect3 will not cache because is drawing on parent2 group cache',
    ).toBe(false);
    // @ts-expect-error -- partial shadow object
    group2.shadow = { offsetX: 2, offsetY: 0 };
    // @ts-expect-error -- partial shadow object
    rect1.shadow = { offsetX: 0, offsetY: 2 };

    expect(
      group3.shouldCache(),
      'group3 will cache because children have shadow',
    ).toBe(false);
    expect(
      group2.shouldCache(),
      'group2 will cache because is not drawing on parent group3 cache and no children have shadow',
    ).toBe(true);
    expect(
      group.shouldCache(),
      'group will not cache because even if is not drawing on parent group3 cache children have shadow',
    ).toBe(false);

    expect(
      rect1.shouldCache(),
      'rect1 will cache because none of its parent is caching',
    ).toBe(true);
    expect(
      rect3.shouldCache(),
      'rect3 will not cache because group2 is caching',
    ).toBe(false);
  });

  it('canvas prop propagation with set', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      group = new Group([rect1, rect2]);

    group.set('canvas', 'a-canvas');
    expect(group.canvas, 'canvas has been set').toBe('a-canvas');
    expect(group._objects[0].canvas, 'canvas has been set on object 0').toBe(
      'a-canvas',
    );
    expect(group._objects[1].canvas, 'canvas has been set on object 1').toBe(
      'a-canvas',
    );
  });

  it('canvas prop propagation with add', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      group = new Group([rect1, rect2]);

    canvas.add(group);
    expect(group.canvas, 'canvas has been set').toBe(canvas);
    expect(group._objects[0].canvas, 'canvas has been set on object 0').toBe(
      canvas,
    );
    expect(group._objects[1].canvas, 'canvas has been set on object 1').toBe(
      canvas,
    );
  });

  it('canvas prop propagation with add to group', () => {
    const rect1 = new Rect({
        top: 1,
        left: 1,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      rect2 = new Rect({
        top: 5,
        left: 5,
        width: 2,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
        opacity: 1,
        objectCaching: true,
      }),
      group = new Group();

    canvas.add(group);
    expect(group.canvas, 'canvas has been set').toBe(canvas);
    group.add(rect1);
    expect(group._objects[0].canvas, 'canvas has been set on object 0').toBe(
      canvas,
    );
    group.add(rect2);
    expect(group._objects[1].canvas, 'canvas has been set on object 0').toBe(
      canvas,
    );
  });

  it('add and coordinates', () => {
    const rect1 = new Rect({
        top: 2,
        left: 2.5,
        width: 3,
        height: 2,
        strokeWidth: 0,
        fill: 'red',
      }),
      rect2 = new Rect({
        top: 6,
        left: 8,
        width: 2,
        height: 6,
        angle: 90,
        strokeWidth: 0,
        fill: 'red',
      });
    const group = new Group([], { layoutManager: new LayoutManager() });

    group.add(rect1);
    group.add(rect2);
    group.scaleX = 3;
    group.scaleY = 2;
    group.setPositionByOrigin(new Point(5, 5), 'left', 'top');
    group.removeAll();

    expect(rect1.top, 'top has been moved').toBe(7);
    expect(rect1.left, 'left has been moved').toBe(9.5);
    expect(rect1.scaleX, 'scaleX has been scaled').toBe(3);
    expect(rect1.scaleY, 'scaleY has been scaled').toBe(2);
    expect(rect2.top, 'top has been moved').toBe(15);
    expect(rect2.left, 'left has been moved').toBe(26);
    expect(
      rect2.scaleX,
      'scaleX has been scaled inverted because of angle 90',
    ).toBe(2);
    expect(
      rect2.scaleY,
      'scaleY has been scaled inverted because of angle 90',
    ).toBe(3);
  });

  // QUnit.skip('addRelativeToGroup and coordinates with nested groups', function(assert) {
  //   var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
  //     rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
  //     group0 = new fabric.Group([rect1, rect2]),
  //     rect3 = new fabric.Rect({ top: 2, left: 9, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
  //     rect4 = new fabric.Rect({ top: 3, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
  //     group1 = new fabric.Group([rect3, rect4], { scaleX: 3, scaleY: 4 }),
  //     group = new fabric.Group([group0, group1], { angle: 90, scaleX: 2, scaleY: 0.5 }),
  //     rect5 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' });
  //
  //   group1.addRelativeToGroup(rect5);
  //   var t = group1.calcTransformMatrix();
  //   fabric.util.transformPoint(new fabric.Point(rect5.left, rect5.top), t);
  //   assert.equal(rect5.top, -5.5, 'top has been moved');
  //   assert.equal(rect5.left, -19.5, 'left has been moved');
  //   assert.equal(rect5.scaleX, 2, 'scaleX has been scaled');
  //   assert.equal(rect5.scaleY, 0.5, 'scaleY has been scaled');
  //   group.removeAll();
  //   group1.removeAll();
  //   assert.equal(rect5.top, 1, 'top is back to original minus rounding errors');
  //   assert.equal(rect5.left, 1, 'left is back to original');
  //   assert.equal(rect5.scaleX, 1, 'scaleX is back to original');
  //   assert.equal(rect5.scaleY, 1, 'scaleY is back to original');
  // });

  // QUnit.test('cloning group with image', function(assert) {
  //   var done = assert.async();
  //   var rect = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
  //       img = new fabric.Image(_createImageElement()),
  //       group = new fabric.Group([ rect, img ]);

  //   img.src = 'foo.png';

  //   group.clone(function(clone) {
  //     assert.ok(clone !== group);
  //     assert.deepEqual(clone.toObject(), group.toObject());

  //     done();
  //   });
  // });
});

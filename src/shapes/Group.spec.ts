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

const makeGenericGroup = (options?: Partial<GroupProps>) => {
  const objs = [new FabricObject(), new FabricObject()];
  const group = new Group(objs, options);
  return {
    group,
    originalObjs: objs,
  };
};

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
      left: 6,
      top: 4,
      strokeWidth: 0,
      objects: [
        new Rect({
          width: 100,
          height: 100,
          top: 0,
          left: 0,
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
      // TO DO BUG: this should be 30
      expect(group.width).toBe(31);
      expect(group.height).toBe(11);
      group.add(new Rect({ width: 1000, height: 1000, top: -500, left: -500 }));
      // group position and size will not change
      expect(group.top).toBe(20);
      expect(group.left).toBe(40);
      // TO DO BUG: this should be 30
      expect(group.width).toBe(31);
      expect(group.height).toBe(11);
    });
  });

  it('triggerLayout should preform layout, layoutManager is defined', () => {
    const group = new Group();
    expect(group.layoutManager).toBeDefined();
    const performLayout = jest.spyOn(group.layoutManager, 'performLayout');

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

    const eventsSpy = jest.spyOn(object, 'fire');
    const removeSpy = jest.spyOn(group, 'remove');
    const exitSpy = jest.spyOn(group, 'exitGroup');
    const enterSpy = jest.spyOn(group2, 'enterGroup');

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
});

import { FixedLayout } from '../LayoutManager';
import { Canvas } from '../canvas/Canvas';
import { Group } from './Group';
import { Rect } from './Rect';
import { FabricObject } from './Object/FabricObject';

describe('Group', () => {
  it('avoid mutations to passed objects array', () => {
    const objs = [new FabricObject(), new FabricObject()];
    const group = new Group(objs);

    group.add(new FabricObject());

    expect(group._objects).not.toBe(objs);
    expect(objs).toHaveLength(2);
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
        new Rect({ width: 100, height: 100, top: 0, left: 0, strokeWidth: 0 }),
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

  describe('With fit-content layout manager', () => {
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
        objectOptions
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
        objectOptions
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
        objectOptions
      );
      expect(group.left).toBe(60);
      expect(group.top).toBe(50);
      expect(group.width).toBe(100);
      expect(group.height).toBe(100);
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

import { Group } from './Group';
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

  test.only('initialization edge case', () => {
    const child = new FabricObject({ width: 200, height: 200, strokeWidth: 0 });
    const group = new Group([child], {
      width: 200,
      height: 200,
      strokeWidth: 0,
    });
    expect(child.getRelativeCenterPoint()).toMatchObject({ x: 0, y: 0 });
    expect(group.getCenterPoint()).toMatchObject({ x: 100, y: 100 });
    expect(child.getCenterPoint()).toMatchObject(group.getCenterPoint());
  });
});

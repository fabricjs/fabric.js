import { Point } from '../Point';
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

  test('initialization edge case', () => {
    const child = new FabricObject({ width: 200, height: 200 });
    const group = new Group([child], { width: 200, height: 200 });
    expect(child.getRelativeCenterPoint()).toMatchObject(new Point());
    expect(child.getCenterPoint()).toMatchObject(group.getCenterPoint());
  });
});

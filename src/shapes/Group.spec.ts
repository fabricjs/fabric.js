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

  it('avoid Group transform for children bounding box during initialization', () => {
    const child = new FabricObject({ width: 200, height: 200 });
    const group = new Group([child], { width: 200, height: 200 });
    const xy = child.getRelativeXY();

    expect(xy.x).toBe(-100);
    expect(xy.y).toBe(-100);
  });
});

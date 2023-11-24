import { FixedLayout } from '../LayoutManager';
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
});

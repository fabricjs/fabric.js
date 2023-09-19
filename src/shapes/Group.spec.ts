import { FixedLayout, LayoutManager } from '../LayoutManager';
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

  it.each([true, false])(
    'triggerLayout should preform layout, layoutManager is defined %s',
    (defined) => {
      const manager = new LayoutManager();
      const performLayout = jest.spyOn(manager, 'performLayout');

      const group = new Group();
      expect(group.layoutManager).toBeUndefined();
      defined && (group.layoutManager = manager);

      group.triggerLayout({ manager });
      const fixedLayout = new FixedLayout();
      group.triggerLayout({ manager, strategy: fixedLayout });
      manager.strategy = new FixedLayout();
      group.triggerLayout({ manager });
      expect(performLayout).toHaveBeenCalledTimes(3);
      expect(performLayout).toHaveBeenNthCalledWith(1, {
        strategy: manager.strategy,
        target: group,
        type: 'imperative',
      });
      expect(performLayout).toHaveBeenNthCalledWith(2, {
        strategy: fixedLayout,
        target: group,
        type: 'imperative',
      });
      expect(performLayout).toHaveBeenNthCalledWith(3, {
        strategy: fixedLayout,
        target: group,
        type: 'imperative',
      });
    }
  );
});

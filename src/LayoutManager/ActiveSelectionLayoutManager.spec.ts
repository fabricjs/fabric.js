import type { TModificationEvents } from '../EventTypeDefs';
import { ActiveSelection } from '../shapes/ActiveSelection';
import { Group } from '../shapes/Group';
import { FabricObject } from '../shapes/Object/FabricObject';
import { ActiveSelectionLayoutManager } from './ActiveSelectionLayoutManager';

import { describe, expect, it, vi } from 'vitest';

describe('ActiveSelectionLayoutManager', () => {
  describe('onBeforeLayout', () => {
    describe('triggers', () => {
      const triggers: ('modified' | TModificationEvents | 'changed')[] = [
        'modified',
        'moving',
        'resizing',
        'rotating',
        'scaling',
        'skewing',
        'changed',
        'modifyPoly',
        'modifyPath',
      ];

      it('should subscribe activeSelection that contains object', () => {
        const manager = new ActiveSelectionLayoutManager();
        const object = new FabricObject();
        new Group([object], {
          interactive: true,
          subTargetCheck: true,
        });
        const as = new ActiveSelection([object], { layoutManager: manager });
        const objectOn = vi.spyOn(object, 'on');
        const objectOff = vi.spyOn(object, 'off');
        const asOn = vi.spyOn(as, 'on');
        manager.subscribeTargets({
          targets: [object],
          target: as,
        });
        expect(objectOn).not.toHaveBeenCalled();
        expect(objectOff).not.toHaveBeenCalled();
        expect(asOn).toHaveBeenCalledTimes(triggers.length);
        expect(objectOff).not.toHaveBeenCalled();
      });

      it('a subscribed activeSelection should trigger layout on the object parent once per parent', () => {
        const object = new FabricObject();
        const object2 = new FabricObject();
        const object3 = new FabricObject();
        const object4 = new FabricObject();
        const group = new Group([object, object2], {
          interactive: true,
          subTargetCheck: true,
        });
        const group2 = new Group([object3, object4], {
          interactive: true,
          subTargetCheck: true,
        });
        const as = new ActiveSelection([object, object2, object3, object4]);
        const asPerformLayout = vi.spyOn(as.layoutManager, 'performLayout');
        const groupPerformLayout = vi.spyOn(
          group.layoutManager,
          'performLayout',
        );
        const groupPerformLayout2 = vi.spyOn(
          group2.layoutManager,
          'performLayout',
        );
        groupPerformLayout.mockClear();
        groupPerformLayout2.mockClear();
        asPerformLayout.mockClear();
        // group have registered the AS
        expect(group.layoutManager['_subscriptions'].get(as)).toBeDefined();
        expect(group2.layoutManager['_subscriptions'].get(as)).toBeDefined();
        // the AS has registered nothing
        expect(as.layoutManager['_subscriptions'].size).toBe(0);

        const event = { foo: 'bar' };
        triggers.forEach((trigger) => as.fire(trigger, event));
        // the as does not need to perform a layout and indeed is not called
        expect(asPerformLayout).not.toHaveBeenCalled();
        expect(groupPerformLayout.mock.calls).toMatchObject([
          [
            {
              e: event,
              target: group,
              trigger: 'modified',
              type: 'object_modified',
            },
          ],
          ...triggers.slice(1).map((trigger) => [
            {
              e: event,
              target: group,
              trigger,
              type: 'object_modifying',
            },
          ]),
        ]);
        expect(groupPerformLayout2.mock.calls).toMatchObject([
          [
            {
              e: event,
              target: group2,
              trigger: 'modified',
              type: 'object_modified',
            },
          ],
          ...triggers.slice(1).map((trigger) => [
            {
              e: event,
              target: group2,
              trigger,
              type: 'object_modifying',
            },
          ]),
        ]);
        expect(groupPerformLayout).toHaveBeenCalledTimes(triggers.length);
        expect(groupPerformLayout2).toHaveBeenCalledTimes(triggers.length);
        // we remove a single object, but both group and group2 have multiple object in the as
        // so with this removal nothing changes.
        as.remove(object);
        groupPerformLayout.mockClear();
        groupPerformLayout2.mockClear();
        asPerformLayout.mockClear();

        triggers.forEach((trigger) => as.fire(trigger, event));
        expect(asPerformLayout).not.toHaveBeenCalled();
        expect(groupPerformLayout.mock.calls).toMatchObject([
          [
            {
              e: event,
              target: group,
              trigger: 'modified',
              type: 'object_modified',
            },
          ],
          ...triggers.slice(1).map((trigger) => [
            {
              e: event,
              target: group,
              trigger,
              type: 'object_modifying',
            },
          ]),
        ]);
        expect(groupPerformLayout2.mock.calls).toMatchObject([
          [
            {
              e: event,
              target: group2,
              trigger: 'modified',
              type: 'object_modified',
            },
          ],
          ...triggers.slice(1).map((trigger) => [
            {
              e: event,
              target: group2,
              trigger,
              type: 'object_modifying',
            },
          ]),
        ]);
        expect(groupPerformLayout).toHaveBeenCalledTimes(triggers.length);
        expect(groupPerformLayout2).toHaveBeenCalledTimes(triggers.length);

        groupPerformLayout.mockClear();
        groupPerformLayout2.mockClear();
        asPerformLayout.mockClear();
        // now that we deselect object 2, the first group is out from the AS
        as.remove(object2);
        expect(group.layoutManager['_subscriptions'].get(as)).toBeUndefined();
        expect(group2.layoutManager['_subscriptions'].get(as)).toBeDefined();
        // now the active selection is empty and none of the groups is affected by the AS events
        as.removeAll();
        expect(group2.layoutManager['_subscriptions'].get(as)).toBeUndefined();

        groupPerformLayout.mockClear();
        groupPerformLayout2.mockClear();
        asPerformLayout.mockClear();

        triggers.forEach((trigger) => as.fire(trigger, event));
        expect(groupPerformLayout).not.toHaveBeenCalled();
        expect(groupPerformLayout2).not.toHaveBeenCalled();
        expect(asPerformLayout).not.toHaveBeenCalled();
      });
    });
  });
});

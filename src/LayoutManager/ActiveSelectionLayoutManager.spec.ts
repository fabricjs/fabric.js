import type { TModificationEvents } from '../EventTypeDefs';
import { ActiveSelection } from '../shapes/ActiveSelection';
import { Group } from '../shapes/Group';
import { FabricObject } from '../shapes/Object/FabricObject';
import { ActiveSelectionLayoutManager } from './ActiveSelectionLayoutManager';

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
      ];

      it('should subscribe activeSelection that contains object', () => {
        const manager = new ActiveSelectionLayoutManager();
        const object = new FabricObject();
        const group = new Group([object], {
          interactive: true,
          subTargetCheck: true,
        });
        const as = new ActiveSelection([object], { layoutManager: manager });
        const objectOn = jest.spyOn(object, 'on');
        const objectOff = jest.spyOn(object, 'off');
        const asOn = jest.spyOn(as, 'on');
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
        const manager = new ActiveSelectionLayoutManager();
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
        const as = new ActiveSelection([object, object2, object3, object4], {
          layoutManager: manager,
        });
        const asPerformLayout = jest.spyOn(manager, 'performLayout');
        const groupPerformLayout = jest.spyOn(
          group.layoutManager,
          'performLayout'
        );
        const groupPerformLayout2 = jest.spyOn(
          group2.layoutManager,
          'performLayout'
        );
        groupPerformLayout.mockClear();
        asPerformLayout.mockClear();
        const event = { foo: 'bar' };
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
        groupPerformLayout.mockClear();
        asPerformLayout.mockClear();
        // we don't keep record of subscriptions on objects
        expect(manager['_subscriptions'].get(object)).toBeUndefined();
        expect(manager['_subscriptions'].get(object2)).toBeUndefined();
        expect(manager['_subscriptions'].get(object3)).toBeUndefined();
        expect(manager['_subscriptions'].get(object4)).toBeUndefined();
        expect(manager['_subscriptions'].get(group2)).toBeDefined();
        expect(manager['_subscriptions'].get(group)).toBeDefined();
        manager.unsubscribeTargets({
          targets: [object, object2, object3, object4],
          target: as,
        });
        expect(manager['_subscriptions'].get(group2)).toBeUndefined();
        expect(manager['_subscriptions'].get(group)).toBeUndefined();
        triggers.forEach((trigger) => as.fire(trigger, event));
        expect(groupPerformLayout).not.toHaveBeenCalled();
        expect(asPerformLayout).not.toHaveBeenCalled();
      });

      it('a subscribed activeSelection with more objects in the same parent has a bug', () => {
        const manager = new ActiveSelectionLayoutManager();
        const object = new FabricObject();
        const object2 = new FabricObject();
        const object3 = new FabricObject();
        const group = new Group([object, object2, object3], {
          interactive: true,
          subTargetCheck: true,
        });
        const as = new ActiveSelection([object, object2, object3], {
          layoutManager: manager,
        });
        const asPerformLayout = jest.spyOn(manager, 'performLayout');
        const groupPerformLayout = jest.spyOn(
          group.layoutManager,
          'performLayout'
        );
        groupPerformLayout.mockClear();
        asPerformLayout.mockClear();
        const event = { foo: 'bar' };
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
        groupPerformLayout.mockClear();
        asPerformLayout.mockClear();
        // we don't keep record of subscriptions on objects
        expect(manager['_subscriptions'].get(object)).toBeUndefined();
        expect(manager['_subscriptions'].get(object2)).toBeUndefined();
        expect(manager['_subscriptions'].get(object3)).toBeUndefined();
        expect(manager['_subscriptions'].get(group)).toBeDefined();
        as.remove(object3);
        groupPerformLayout.mockClear();
        asPerformLayout.mockClear();
        // BUG! i removed an object only and group layour is not called anymore
        expect(manager['_subscriptions'].get(group)).toBeUndefined();
        triggers.forEach((trigger) => as.fire(trigger, event));
        expect(groupPerformLayout).not.toHaveBeenCalled();
      });
    });
  });
});

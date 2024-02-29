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

      it('a subscribed activeSelection should trigger layout on the object parent', () => {
        const manager = new ActiveSelectionLayoutManager();
        const object = new FabricObject();
        const group = new Group([object], {
          interactive: true,
          subTargetCheck: true,
        });
        const as = new ActiveSelection([object], { layoutManager: manager });
        const asPerformLayout = jest.spyOn(manager, 'performLayout');
        const groupPerformLayout = jest.spyOn(
          object.parent!.layoutManager,
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
        expect(manager['_subscriptions'].get(object)).toBeDefined();
        manager.unsubscribeTargets({ targets: [object], target: as });
        expect(manager['_subscriptions'].get(object)).toBeUndefined();
        triggers.forEach((trigger) => as.fire(trigger, event));
        expect(groupPerformLayout).not.toHaveBeenCalled();
        expect(asPerformLayout).not.toHaveBeenCalled();
      });
    });
  });
});

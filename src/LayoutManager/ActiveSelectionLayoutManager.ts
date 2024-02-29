import { LayoutManager, layoutingEvents } from './LayoutManager';
import type { RegistrationContext, StrictLayoutContext } from './types';
import {
  LAYOUT_TYPE_OBJECT_MODIFIED,
  LAYOUT_TYPE_OBJECT_MODIFYING,
} from './constants';
import type { FabricObject } from '../shapes/Object/FabricObject';

/**
 * The ActiveSelectionLayoutManager is exactly as the LayoutManager
 * But what it does differently is that it subscribes the activeSelection
 * modification events to modify the layout of the original group of the
 * children. This is done by swapping target and object in the subscribeTargets
 * method. All the rest is identical
 */
export class ActiveSelectionLayoutManager extends LayoutManager {
  /**
   * subscribe to object layout triggers
   */
  protected attachHandlers(
    childObject: FabricObject,
    context: RegistrationContext & Partial<StrictLayoutContext>
  ): (() => void)[] {
    const { parent, group: activeSelection } = childObject;
    if (!parent || !activeSelection || activeSelection === parent) {
      // nothing to do here
      return [];
    }

    return [
      activeSelection.on('modified', (e) => {
        parent.layoutManager.performLayout({
          trigger: 'modified',
          e,
          type: LAYOUT_TYPE_OBJECT_MODIFIED,
          target: parent,
        });
      }),
      ...layoutingEvents.map((key) =>
        activeSelection.on(key, (e) => {
          parent.layoutManager.performLayout({
            trigger: key,
            e,
            type: LAYOUT_TYPE_OBJECT_MODIFYING,
            target: parent,
          });
        })
      ),
    ];
  }
}

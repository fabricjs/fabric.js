import { LayoutManager, buildStandardEvents } from './LayoutManager';
import type { RegistrationContext, StrictLayoutContext } from './types';
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
    return buildStandardEvents(activeSelection, parent);
  }
}

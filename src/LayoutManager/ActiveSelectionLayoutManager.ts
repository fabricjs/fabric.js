import { LayoutManager, buildStandardEvents } from './LayoutManager';
import type { RegistrationContext, StrictLayoutContext } from './types';
import type { FabricObject } from '../shapes/Object/FabricObject';

/**
 * Today the LayoutManager class also takes care of subscribing event handlers
 * to update the group layout when the group is interactive and a transform is applied
 * to a child object.
 * The ActiveSelection is never interactive, but it could contain obejcts from
 * groups that are.
 * The standard LayoutManager would subscribe the children of the activeSelection to
 * perform layout changes to the activeselection itself, what we need instead is that
 * the transformation applied to the active selection will trigger changes to the
 * original group of the children ( the one referenced under the parent property )
 * This subclass of the LayoutManager has a single duty to fill the gap of this difference.
 */
export class ActiveSelectionLayoutManager extends LayoutManager {
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

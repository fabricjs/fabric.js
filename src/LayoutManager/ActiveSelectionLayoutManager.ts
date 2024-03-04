import { LayoutManager } from './LayoutManager';
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
  /**
   * Subscribe an object to transforms events that will trigger a layout change in the group
   * This is important only for interactive groups.
   * @param object
   * @param context
   */
  protected subscribe(
    object: FabricObject,
    context: RegistrationContext & Partial<StrictLayoutContext>
  ) {
    const { parent, group: activeSelection } = object;
    if (!parent || !activeSelection || activeSelection === parent) {
      // nothing to do here
      return;
    }
    this.unsubscribe(object, context);
    const disposers = this.attachHandlers(activeSelection, {
      target: parent,
      targets: [object],
    });
    // subscriptions are on the parent, so the active seleciton
    // will keep has many copies of events has many unique groups
    // is interfering with
    this._subscriptions.set(parent, disposers);
  }

  /**
   * unsubscribe object layout triggers
   */
  protected unsubscribe(
    object: FabricObject,
    context?: RegistrationContext & Partial<StrictLayoutContext>
  ) {
    const { parent } = object;
    if (parent) {
      (this._subscriptions.get(parent) || []).forEach((d) => d());
      this._subscriptions.delete(parent);
    }
  }
}

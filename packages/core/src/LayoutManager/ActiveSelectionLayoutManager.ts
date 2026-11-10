import { LayoutManager } from './LayoutManager';
import type { RegistrationContext, StrictLayoutContext } from './types';
import type { Group } from '../shapes/Group';

/**
 * Today the LayoutManager class also takes care of subscribing event handlers
 * to update the group layout when the group is interactive and a transform is applied
 * to a child object.
 * The ActiveSelection is never interactive, but it could contain objects from
 * groups that are.
 * The standard LayoutManager would subscribe the children of the activeSelection to
 * perform layout changes to the active selection itself, what we need instead is that
 * the transformation applied to the active selection will trigger changes to the
 * original group of the children ( the one referenced under the parent property )
 * This subclass of the LayoutManager has a single duty to fill the gap of this difference.`
 */
export class ActiveSelectionLayoutManager extends LayoutManager {
  subscribeTargets(
    context: RegistrationContext & Partial<StrictLayoutContext>,
  ): void {
    const activeSelection = context.target;
    const parents = context.targets.reduce((parents, target) => {
      target.parent && parents.add(target.parent);
      return parents;
    }, new Set<Group>());
    parents.forEach((parent) => {
      parent.layoutManager.subscribeTargets({
        target: parent,
        targets: [activeSelection],
      });
    });
  }

  /**
   * unsubscribe from parent only if all its children were deselected
   */
  unsubscribeTargets(
    context: RegistrationContext & Partial<StrictLayoutContext>,
  ): void {
    const activeSelection = context.target;
    const selectedObjects = activeSelection.getObjects();
    const parents = context.targets.reduce((parents, target) => {
      target.parent && parents.add(target.parent);
      return parents;
    }, new Set<Group>());
    parents.forEach((parent) => {
      !selectedObjects.some((object) => object.parent === parent) &&
        parent.layoutManager.unsubscribeTargets({
          target: parent,
          targets: [activeSelection],
        });
    });
  }
}

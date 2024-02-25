import { LayoutManager } from './LayoutManager';
import type { RegistrationContext, StrictLayoutContext } from './types';

/**
 * The ActiveSelectionLayoutManager is exactly as the LayoutManager
 * But what it does differently is that it subscribes the activeSelection
 * modification events to modify the layout of the original group of the
 * children. This is done by swapping target and object in the subscribeTargets
 * method. All the rest is identical
 */
export class ActiveSelectionLayoutManager extends LayoutManager {
  subscribeTargets(
    context: RegistrationContext & Partial<StrictLayoutContext>
  ) {
    context.targets.forEach((object) => {
      const { parent, group } = object;
      parent &&
        group &&
        parent.layoutManager.subscribe(group, {
          target: parent, // the original group, the one that will need a relayour
          targets: context.targets,
        });
    });
  }
}

import type { StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';

/**
 * Layout will adjust the bounding box to fit target's objects.
 */
export class FitContentLayout extends LayoutStrategy {
  static readonly type = 'fit-content';

  /**
   * @override layout on all triggers
   * Override at will
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldPerformLayout(context: StrictLayoutContext) {
    return true;
  }

  /**
   * @override Reset transform if there are no children
   */
  shouldResetTransform(context: StrictLayoutContext) {
    return context.target.size() === 0;
  }
}

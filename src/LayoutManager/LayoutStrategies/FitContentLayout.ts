import type { StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';

export class FitContentLayout extends LayoutStrategy {
  /**
   * @override layout on all triggers
   * Override at will
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldPerformLayout(context: StrictLayoutContext) {
    return true;
  }
}

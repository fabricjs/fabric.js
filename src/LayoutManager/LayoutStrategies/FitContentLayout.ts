import type { StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';
import { classRegistry } from '../../ClassRegistry';
import { LAYOUT_TYPE_INITIALIZATION } from '../constants';

/**
 * Layout will adjust the bounding box to fit target's objects.
 */
export class FitContentLayout extends LayoutStrategy {
  static readonly type = 'fit-content';

  /**
   * @override layout on all triggers apart from `fromObject` initialization
   * Override at will
   */
  shouldPerformLayout(context: StrictLayoutContext) {
    return context.type !== LAYOUT_TYPE_INITIALIZATION || !this._fromObject;
  }
}

classRegistry.setClass(FitContentLayout);

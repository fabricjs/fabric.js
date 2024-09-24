import { defineProperty as _defineProperty } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { LayoutStrategy } from './LayoutStrategy.mjs';
import { classRegistry } from '../../ClassRegistry.mjs';

/**
 * Layout will adjust the bounding box to fit target's objects.
 */
class FitContentLayout extends LayoutStrategy {
  /**
   * @override layout on all triggers
   * Override at will
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldPerformLayout(context) {
    return true;
  }
}
_defineProperty(FitContentLayout, "type", 'fit-content');
classRegistry.setClass(FitContentLayout);

export { FitContentLayout };
//# sourceMappingURL=FitContentLayout.mjs.map

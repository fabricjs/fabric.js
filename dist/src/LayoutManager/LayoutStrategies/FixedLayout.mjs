import { defineProperty as _defineProperty } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Point } from '../../Point.mjs';
import { LayoutStrategy } from './LayoutStrategy.mjs';
import { classRegistry } from '../../ClassRegistry.mjs';

/**
 * Layout will keep target's initial size.
 */
class FixedLayout extends LayoutStrategy {
  /**
   * @override respect target's initial size
   */
  getInitialSize(_ref, _ref2) {
    let {
      target
    } = _ref;
    let {
      size
    } = _ref2;
    return new Point(target.width || size.x, target.height || size.y);
  }
}
_defineProperty(FixedLayout, "type", 'fixed');
classRegistry.setClass(FixedLayout);

export { FixedLayout };
//# sourceMappingURL=FixedLayout.mjs.map

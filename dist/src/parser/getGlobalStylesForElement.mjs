import { objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { elementMatchesRule } from './elementMatchesRule.mjs';

/**
 * @private
 */

function getGlobalStylesForElement(element) {
  let cssRules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let styles = {};
  for (const rule in cssRules) {
    if (elementMatchesRule(element, rule.split(' '))) {
      styles = _objectSpread2(_objectSpread2({}, styles), cssRules[rule]);
    }
  }
  return styles;
}

export { getGlobalStylesForElement };
//# sourceMappingURL=getGlobalStylesForElement.mjs.map

import { elementMatchesRule } from './elementMatchesRule';
import type { CSSRules } from './typedefs';

/**
 * @private
 */

export function getGlobalStylesForElement(
  element: HTMLElement,
  cssRules: CSSRules = {},
) {
  let styles: Record<string, string> = {};
  for (const rule in cssRules) {
    if (elementMatchesRule(element, rule.split(' '))) {
      styles = {
        ...styles,
        ...cssRules[rule],
      };
    }
  }
  return styles;
}

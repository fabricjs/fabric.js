//@ts-nocheck
import { cssRules } from './constants';
import { elementMatchesRule } from './elementMatchesRule';

/**
 * @private
 */

export function getGlobalStylesForElement(element, svgUid) {
  const styles = {};
  for (const rule in cssRules[svgUid]) {
    if (elementMatchesRule(element, rule.split(' '))) {
      for (const property in cssRules[svgUid][rule]) {
        styles[property] = cssRules[svgUid][rule][property];
      }
    }
  }
  return styles;
}

//@ts-nocheck
import { cssRules } from './constants';
import { elementMatchesRule } from "./elementMatchesRule";

/**
 * @private
 */

export function getGlobalStylesForElement(element, svgUid) {
    var styles = {};
    for (var rule in cssRules[svgUid]) {
        if (elementMatchesRule(element, rule.split(' '))) {
            for (var property in cssRules[svgUid][rule]) {
                styles[property] = cssRules[svgUid][rule][property];
            }
        }
    }
    return styles;
}

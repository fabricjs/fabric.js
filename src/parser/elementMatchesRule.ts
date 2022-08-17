//@ts-nocheck

import { selectorMatches } from "./selectorMatches";
import { doesSomeParentMatch } from "./doesSomeParentMatch";

/**
 * @private
 */

export function elementMatchesRule(element, selectors) {
    let firstMatching, parentMatching = true;
    //start from rightmost selector.
    firstMatching = selectorMatches(element, selectors.pop());
    if (firstMatching && selectors.length) {
        parentMatching = doesSomeParentMatch(element, selectors);
    }
    return firstMatching && parentMatching && (selectors.length === 0);
}

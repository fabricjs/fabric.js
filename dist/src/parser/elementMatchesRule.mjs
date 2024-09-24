import { selectorMatches } from './selectorMatches.mjs';
import { doesSomeParentMatch } from './doesSomeParentMatch.mjs';

/**
 * @private
 */

function elementMatchesRule(element, selectors) {
  let parentMatching = true;
  // start from rightmost selector.
  const firstMatching = selectorMatches(element, selectors.pop());
  if (firstMatching && selectors.length) {
    parentMatching = doesSomeParentMatch(element, selectors);
  }
  return firstMatching && parentMatching && selectors.length === 0;
}

export { elementMatchesRule };
//# sourceMappingURL=elementMatchesRule.mjs.map

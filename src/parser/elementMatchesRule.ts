import { selectorMatches } from './selectorMatches';
import { doesSomeParentMatch } from './doesSomeParentMatch';

/**
 * @private
 */

export function elementMatchesRule(element: HTMLElement, selectors: string[]) {
  let parentMatching = true;
  // start from rightmost selector.
  const firstMatching = selectorMatches(element, selectors.pop()!);
  if (firstMatching && selectors.length) {
    parentMatching = doesSomeParentMatch(element, selectors);
  }
  return firstMatching && parentMatching && selectors.length === 0;
}

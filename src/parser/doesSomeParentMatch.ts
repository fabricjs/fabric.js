//@ts-nocheck
import { selectorMatches } from './selectorMatches';

export function doesSomeParentMatch(element, selectors) {
  let selector,
    parentMatching = true;
  while (
    element.parentNode &&
    element.parentNode.nodeType === 1 &&
    selectors.length
  ) {
    if (parentMatching) {
      selector = selectors.pop();
    }
    element = element.parentNode;
    parentMatching = selectorMatches(element, selector);
  }
  return selectors.length === 0;
}

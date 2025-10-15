import { selectorMatches } from './selectorMatches';

export function doesSomeParentMatch(
  element: HTMLElement | SVGElement,
  selectors: string[],
) {
  let selector: string,
    parentMatching = true;
  while (
    element.parentElement &&
    element.parentElement.nodeType === 1 &&
    selectors.length
  ) {
    if (parentMatching) {
      selector = selectors.pop()!;
    }
    element = element.parentElement;
    parentMatching = selectorMatches(element, selector!);
  }
  return selectors.length === 0;
}

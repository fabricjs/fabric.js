import { svgInvalidAncestors } from './constants';
import { getSvgRegex } from './getSvgRegex';

const svgInvalidAncestorsRegEx = getSvgRegex(svgInvalidAncestors);

export function hasInvalidAncestor(element: Element) {
  let _element: Element | null = element;
  while (_element && (_element = _element.parentElement)) {
    if (
      _element &&
      _element.nodeName &&
      svgInvalidAncestorsRegEx.test(_element.nodeName.replace('svg:', '')) &&
      !_element.getAttribute('instantiated_by_use')
    ) {
      return true;
    }
  }
  return false;
}

import { svgInvalidAncestors } from './constants.mjs';
import { getSvgRegex } from './getSvgRegex.mjs';
import { getTagName } from './getTagName.mjs';

const svgInvalidAncestorsRegEx = getSvgRegex(svgInvalidAncestors);
function hasInvalidAncestor(element) {
  let _element = element;
  while (_element && (_element = _element.parentElement)) {
    if (_element && _element.nodeName && svgInvalidAncestorsRegEx.test(getTagName(_element)) && !_element.getAttribute('instantiated_by_use')) {
      return true;
    }
  }
  return false;
}

export { hasInvalidAncestor };
//# sourceMappingURL=hasInvalidAncestor.mjs.map

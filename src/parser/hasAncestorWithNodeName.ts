//@ts-nocheck

export function hasAncestorWithNodeName(element, nodeName) {
  while (element && (element = element.parentNode)) {
    if (
      element.nodeName &&
      nodeName.test(element.nodeName.replace('svg:', '')) &&
      !element.getAttribute('instantiated_by_use')
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Helper function
 * @param element
 * @param nodeName
 */
export function hasAncestorWithNodeName(element: Element | null, nodeName: string | RegExp) {
  nodeName = new RegExp(nodeName);
  while (element) {
    if (
      element.nodeName &&
      nodeName.test(element.nodeName.replace('svg:', '')) &&
      !element.getAttribute('instantiated_by_use')
    ) {
      return true;
    }
    element = element.parentNode as Element;
  }
  return false;
}

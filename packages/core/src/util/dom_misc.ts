/**
 * Returns element scroll offsets
 * @param {HTMLElement} element Element to operate on
 * @return {Object} Object with left/top values
 */
export function getScrollLeftTop(element: HTMLElement | null) {
  const doc = element && getDocumentFromElement(element);
  let left = 0,
    top = 0;
  if (!element || !doc) {
    return { left, top };
  }
  let elementLoop: HTMLElement | Document | ShadowRoot = element;
  const docElement = doc.documentElement,
    body = doc.body || {
      scrollLeft: 0,
      scrollTop: 0,
    };
  // While loop checks (and then sets element to) .parentNode OR .host
  //  to account for ShadowDOM. We still want to traverse up out of ShadowDOM,
  //  but the .parentNode of a root ShadowDOM node will always be null, instead
  //  it should be accessed through .host. See http://stackoverflow.com/a/24765528/4383938
  while (
    elementLoop &&
    (elementLoop.parentNode || (elementLoop as unknown as ShadowRoot).host)
  ) {
    elementLoop = (elementLoop.parentNode ||
      (elementLoop as unknown as ShadowRoot).host) as
      | HTMLElement
      | Document
      | ShadowRoot;
    if (elementLoop === doc) {
      left = body.scrollLeft || docElement.scrollLeft || 0;
      top = body.scrollTop || docElement.scrollTop || 0;
    } else {
      left += (elementLoop as HTMLElement).scrollLeft || 0;
      top += (elementLoop as HTMLElement).scrollTop || 0;
    }

    if (
      elementLoop.nodeType === 1 &&
      (elementLoop as HTMLElement).style.position === 'fixed'
    ) {
      break;
    }
  }

  return { left, top };
}

export const getDocumentFromElement = (el: HTMLElement) =>
  el.ownerDocument || null;

export const getWindowFromElement = (el: HTMLElement) =>
  el.ownerDocument?.defaultView || null;

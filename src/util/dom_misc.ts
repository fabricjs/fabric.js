//@ts-nocheck
/**
 * Wraps element with another element
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to wrap
 * @param {HTMLElement|String} wrapper Element to wrap with
 * @param {Object} [attributes] Attributes to set on a wrapper
 * @return {HTMLElement} wrapper
 */
export function wrapElement(element, wrapper) {
  if (element.parentNode) {
    element.parentNode.replaceChild(wrapper, element);
  }
  wrapper.appendChild(element);
  return wrapper;
}

/**
 * Returns element scroll offsets
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to operate on
 * @return {Object} Object with left/top values
 */
export function getScrollLeftTop(element) {

  let left = 0,
      top = 0;

  const docElement = fabric.document.documentElement,
        body = fabric.document.body || {
          scrollLeft: 0, scrollTop: 0
        };
  // While loop checks (and then sets element to) .parentNode OR .host
  //  to account for ShadowDOM. We still want to traverse up out of ShadowDOM,
  //  but the .parentNode of a root ShadowDOM node will always be null, instead
  //  it should be accessed through .host. See http://stackoverflow.com/a/24765528/4383938
  while (element && (element.parentNode || element.host)) {

    // Set element to element parent, or 'host' in case of ShadowDOM
    element = element.parentNode || element.host;

    if (element === fabric.document) {
      left = body.scrollLeft || docElement.scrollLeft || 0;
      top = body.scrollTop ||  docElement.scrollTop || 0;
    }
    else {
      left += element.scrollLeft || 0;
      top += element.scrollTop || 0;
    }

    if (element.nodeType === 1 && element.style.position === 'fixed') {
      break;
    }
  }

  return { left, top };
}

/**
 * Returns offset for a given element
 * @function
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to get offset for
 * @return {Object} Object with "left" and "top" properties
 */
export function getElementOffset(element) {
  let box = { left: 0, top: 0 };
  const doc = element && element.ownerDocument,
        offset = { left: 0, top: 0 },
        offsetAttributes = {
          borderLeftWidth: 'left',
          borderTopWidth:  'top',
          paddingLeft:     'left',
          paddingTop:      'top'
        };

  if (!doc) {
    return offset;
  }
  const elemStyle = fabric.document.defaultView.getComputedStyle(element, null)
  for (const attr in offsetAttributes) {
    offset[offsetAttributes[attr]] += parseInt(elemStyle[attr], 10) || 0;
  }

  const docElem = doc.documentElement;
  if ( typeof element.getBoundingClientRect !== 'undefined' ) {
    box = element.getBoundingClientRect();
  }

  const scrollLeftTop = getScrollLeftTop(element);

  return {
    left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
    top: box.top + scrollLeftTop.top - (docElem.clientTop || 0)  + offset.top
  };
}

/**
 * Makes element unselectable
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to make unselectable
 * @return {HTMLElement} Element that was passed in
 */
export function makeElementUnselectable(element) {
  if (typeof element.onselectstart !== 'undefined') {
    element.onselectstart = () => false;
  }
  element.style.userSelect = 'none';
  return element;
}

/**
 * Makes element selectable
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to make selectable
 * @return {HTMLElement} Element that was passed in
 */
export function makeElementSelectable(element) {
  if (typeof element.onselectstart !== 'undefined') {
    element.onselectstart = null;
  }
  element.style.userSelect = '';
  return element;
}

export function getNodeCanvas(element) {
  const impl = fabric.jsdomImplForWrapper(element);
  return impl._canvas || impl._image;
};

export function cleanUpJsdomNode(element) {
  if (!fabric.isLikelyNode) {
    return;
  }
  const impl = fabric.jsdomImplForWrapper(element);
  if (impl) {
    impl._image = null;
    impl._canvas = null;
    // unsure if necessary
    impl._currentSrc = null;
    impl._attributes = null;
    impl._classList = null;
  }
}

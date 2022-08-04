//@ts-nocheck

import { parseSVGDocument } from "./parseSVGDocument";

/**
 * Takes url corresponding to an SVG document, and parses it into a set of fabric objects.
 * Note that SVG is fetched via XMLHttpRequest, so it needs to conform to SOP (Same Origin Policy)
 * @memberOf fabric
 * @param {String} url
 * @param {Function} callback
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
export function loadSVGFromURL(url, callback, reviver, options) {
  return fetch(url.replace(/^\n\s*/, '').trim(), {
    method: 'get',
    onComplete: onComplete,
    signal: options && options.signal
  }).then(({ responseXML: xml }) => {
    if (!xml || !xml.documentElement) {
      callback && callback(null);
      return false;
    }
    return parseSVGDocument(xml.documentElement, (results, _options, elements, allElements) => {
        callback && callback(results, _options, elements, allElements);
      }, reviver, options);
  });
}

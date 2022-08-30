//@ts-nocheck

import { request } from "../util/dom_request";
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

  new request(url.replace(/^\n\s*/, '').trim(), {
    method: 'get',
    onComplete: onComplete,
    signal: options && options.signal
  });

  function onComplete(r) {

    const xml = r.responseXML;
    if (!xml || !xml.documentElement) {
      callback && callback(null);
      return false;
    }

    parseSVGDocument(xml.documentElement, function (results, _options, elements, allElements) {
      callback && callback(results, _options, elements, allElements);
    }, reviver, options);
  }
}

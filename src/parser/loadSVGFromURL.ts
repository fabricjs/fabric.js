import { request } from '../util/dom_request';
import { parseSVGDocument } from './parseSVGDocument';
import type { TSvgParsedCallback, TSvgReviverCallback } from './typedefs';
import type { LoadImageOptions } from '../util/misc/objectEnlive';

/**
 * Takes url corresponding to an SVG document, and parses it into a set of fabric objects.
 * Note that SVG is fetched via XMLHttpRequest, so it needs to conform to SOP (Same Origin Policy)
 * @memberOf fabric
 * @param {String} url
 * @param {TSvgParsedCallback} callback Invoked when the parsing is done, with null if parsing wasn't possible of with the list of parsed objects.
 * TSvgParsedCallback receive also `allElements` array as last argument. This is the full array from the list of svg nodes available in the document.
 * You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
 * @param {TSvgReviverCallback} [reviver] Extra callback for further parsing of SVG elements, called after each fabric object created.
 * Takes as input the original svg element and the fabricObject generated as arguments. Used to inspect extra properties eventually not parsed by fabricJS
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
export function loadSVGFromURL(
  url: string,
  callback: TSvgParsedCallback,
  reviver?: TSvgReviverCallback,
  options: LoadImageOptions = {}
) {
  const onComplete = (r: XMLHttpRequest) => {
    const xml = r.responseXML;
    if (!xml || !xml.documentElement) {
      callback && callback(null);
      return false;
    }

    parseSVGDocument(xml.documentElement, callback, reviver, options);
  };

  request(url.replace(/^\n\s*/, '').trim(), {
    method: 'get',
    onComplete,
    signal: options.signal,
  });
}

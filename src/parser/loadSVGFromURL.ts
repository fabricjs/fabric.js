import { createEmptyResponse } from './parseSVGDocument';
import { loadSVGFromString } from './loadSVGFromString';
import type { SVGParsingOutput, TSvgReviverCallback } from './typedefs';
import type { LoadImageOptions } from '../util/misc/objectEnlive';
import { FabricError } from '../util/internals/console';

/**
 * Takes url corresponding to an SVG document, and parses it into a set of fabric objects.
 * Note that SVG is fetched via fetch API, so it needs to conform to SOP (Same Origin Policy)
 * @param {string} url where the SVG is
 * @param {TSvgParsedCallback} callback Invoked when the parsing is done, with null if parsing wasn't possible with the list of svg nodes.
 * {@link TSvgParsedCallback} also receives `allElements` array as the last argument. This is the full list of svg nodes available in the document.
 * You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
 * @param {TSvgReviverCallback} [reviver] Extra callback for further parsing of SVG elements, called after each fabric object has been created.
 * Takes as input the original svg element and the generated `FabricObject` as arguments. Used to inspect extra properties not parsed by fabric,
 * or extra custom manipulation
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
export function loadSVGFromURL(
  url: string,
  reviver?: TSvgReviverCallback,
  options: LoadImageOptions = {},
): Promise<SVGParsingOutput> {
  return fetch(url.replace(/^\n\s*/, '').trim(), {
    signal: options.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new FabricError(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((svgText) => {
      return loadSVGFromString(svgText, reviver, options);
    })
    .catch(() => {
      // this is an unhappy path, we dont care about speed
      return createEmptyResponse();
    });
}

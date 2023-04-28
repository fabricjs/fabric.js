import { getWindow } from '../env';
import { LoadImageOptions } from '../util/misc/objectEnlive';
import { parseSVGDocument } from './parseSVGDocument';
import type { TSvgParsedCallback, TSvgReviverCallback } from './typedefs';

/**
 * Takes string corresponding to an SVG document, and parses it into a set of fabric objects
 * @memberOf fabric
 * @param {String} string
 * @param {TSvgParsedCallback} callback Invoked when the parsing is done, with null if parsing wasn't possible of with the list of parsed objects.
 * TSvgParsedCallback receive also `allElements` array as last argument. This is the full array from the list of svg nodes available in the document.
 * You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
 * @param {TSvgReviverCallback} [reviver] Extra callback for further parsing of SVG elements, called after each fabric object created.
 * Takes as input the original svg element and the fabricObject generated as arguments. Used to inspect extra properties eventually not parsed by fabricJS
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
export function loadSVGFromString(
  string: string,
  callback: TSvgParsedCallback,
  reviver: TSvgReviverCallback,
  options: LoadImageOptions
) {
  const parser = new (getWindow() as any).DOMParser(),
    // should we use `image/svg+xml` here?
    doc = parser.parseFromString(string.trim(), 'text/html');
  parseSVGDocument(doc.documentElement, callback, reviver, options);
}

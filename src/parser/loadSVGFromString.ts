// @ts-nocheck
import { getEnv } from '../env';
import { LoadImageOptions } from '../util/misc/objectEnlive';
import { parseSVGDocument } from './parseSVGDocument';

/**
 * Takes string corresponding to an SVG document, and parses it into a set of fabric objects
 * @param {String} string
 * @param {Function} callback
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
export function loadSVGFromString(
  string: string,
  callback: any,
  reviver: any,
  options: LoadImageOptions
) {
  const parser = new (getEnv().window.DOMParser)(),
    doc = parser.parseFromString(string.trim(), 'text/xml');
  parseSVGDocument(
    doc.documentElement,
    function (results, _options, elements, allElements) {
      callback(results, _options, elements, allElements);
    },
    reviver,
    options
  );
}

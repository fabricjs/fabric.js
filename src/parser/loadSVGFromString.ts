//@ts-nocheck
import { fabric } from '../../HEADER';
import { parseSVGDocument } from './parseSVGDocument';

/**
 * Takes string corresponding to an SVG document, and parses it into a set of fabric objects
 * @memberOf fabric
 * @param {String} string
 * @param {Function} callback
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
export function loadSVGFromString(string, callback, reviver, options) {
  const parser = new fabric.window.DOMParser(),
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

//@ts-nocheck
import { uid } from '../util/internals/uid';
import { applyViewboxTransform } from './applyViewboxTransform';
import {
  clipPaths,
  cssRules,
  gradientDefs,
  svgInvalidAncestorsRegEx,
  svgValidTagNamesRegEx,
} from './constants';
import { getCSSRules } from './getCSSRules';
import { getGradientDefs } from './getGradientDefs';
import { hasAncestorWithNodeName } from './hasAncestorWithNodeName';
import { parseElements } from './parseElements';
import { parseUseDirectives } from './parseUseDirectives';
import type { TSvgParsedCallback, TSvgReviverCallback } from './typedefs';
import type { LoadImageOptions } from '../util/misc/objectEnlive';
/**
 * Parses an SVG document, converts it to an array of corresponding fabric.* instances and passes them to a callback
 * @static
 * @function
 * @memberOf fabric
 * @param {HTMLElement} doc SVG document to parse
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
export function parseSVGDocument(
  doc: HTMLElement,
  callback: TSvgParsedCallback,
  reviver?: TSvgReviverCallback,
  { crossOrigin, signal }: LoadImageOptions = {}
) {
  if (!doc) {
    return;
  }
  if (signal && signal.aborted) {
    throw new Error('`options.signal` is in `aborted` state');
  }
  parseUseDirectives(doc);

  const svgUid = uid(),
    descendants = Array.from(doc.getElementsByTagName('*')),
    options = {
      ...applyViewboxTransform(doc),
      crossOrigin,
      svgUid,
      signal,
    };

  const elements = descendants.filter(function (el) {
    applyViewboxTransform(el);
    return (
      svgValidTagNamesRegEx.test(el.nodeName.replace('svg:', '')) &&
      !hasAncestorWithNodeName(el, svgInvalidAncestorsRegEx)
    ); // http://www.w3.org/TR/SVG/struct.html#DefsElement
  });
  if (!elements || (elements && !elements.length)) {
    callback([], {}, [], descendants);
    return;
  }
  const localClipPaths = {};
  descendants
    .filter((el) => el.nodeName.replace('svg:', '') === 'clipPath')
    .forEach((el) => {
      const id = el.getAttribute('id');
      localClipPaths[id] = Array.from(el.getElementsByTagName('*')).filter(
        (el) => svgValidTagNamesRegEx.test(el.nodeName.replace('svg:', ''))
      );
    });
  gradientDefs[svgUid] = getGradientDefs(doc);
  cssRules[svgUid] = getCSSRules(doc);
  clipPaths[svgUid] = localClipPaths;
  // Precedence of rules:   style > class > attribute
  parseElements(
    elements,
    (instances, elements) => {
      if (callback) {
        callback(instances, options, elements, descendants);
        delete gradientDefs[svgUid];
        delete cssRules[svgUid];
        delete clipPaths[svgUid];
      }
    },
    { ...options },
    reviver,
    { crossOrigin, signal }
  );
}

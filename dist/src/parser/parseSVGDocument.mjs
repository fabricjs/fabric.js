import { objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { applyViewboxTransform } from './applyViewboxTransform.mjs';
import { svgValidTagNamesRegEx } from './constants.mjs';
import { hasInvalidAncestor } from './hasInvalidAncestor.mjs';
import { parseUseDirectives } from './parseUseDirectives.mjs';
import { ElementsParser } from './elements_parser.mjs';
import { log, SignalAbortedError } from '../util/internals/console.mjs';
import { getTagName } from './getTagName.mjs';

const isValidSvgTag = el => svgValidTagNamesRegEx.test(getTagName(el));
const createEmptyResponse = () => ({
  objects: [],
  elements: [],
  options: {},
  allElements: []
});

/**
 * Parses an SVG document, converts it to an array of corresponding fabric.* instances and passes them to a callback
 * @static
 * @function
 * @memberOf fabric
 * @param {HTMLElement} doc SVG document to parse
 * @param {TSvgParsedCallback} callback Invoked when the parsing is done, with null if parsing wasn't possible with the list of svg nodes.
 * @param {TSvgReviverCallback} [reviver] Extra callback for further parsing of SVG elements, called after each fabric object has been created.
 * Takes as input the original svg element and the generated `FabricObject` as arguments. Used to inspect extra properties not parsed by fabric,
 * or extra custom manipulation
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @return {SVGParsingOutput}
 * {@link SVGParsingOutput} also receives `allElements` array as the last argument. This is the full list of svg nodes available in the document.
 * You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
 */
async function parseSVGDocument(doc, reviver) {
  let {
    crossOrigin,
    signal
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (signal && signal.aborted) {
    log('log', new SignalAbortedError('parseSVGDocument'));
    // this is an unhappy path, we dont care about speed
    return createEmptyResponse();
  }
  const documentElement = doc.documentElement;
  parseUseDirectives(doc);
  const descendants = Array.from(documentElement.getElementsByTagName('*')),
    options = _objectSpread2(_objectSpread2({}, applyViewboxTransform(documentElement)), {}, {
      crossOrigin,
      signal
    });
  const elements = descendants.filter(el => {
    applyViewboxTransform(el);
    return isValidSvgTag(el) && !hasInvalidAncestor(el); // http://www.w3.org/TR/SVG/struct.html#DefsElement
  });
  if (!elements || elements && !elements.length) {
    return _objectSpread2(_objectSpread2({}, createEmptyResponse()), {}, {
      options,
      allElements: descendants
    });
  }
  const localClipPaths = {};
  descendants.filter(el => getTagName(el) === 'clipPath').forEach(el => {
    el.setAttribute('originalTransform', el.getAttribute('transform') || '');
    const id = el.getAttribute('id');
    localClipPaths[id] = Array.from(el.getElementsByTagName('*')).filter(el => isValidSvgTag(el));
  });

  // Precedence of rules:   style > class > attribute
  const elementParser = new ElementsParser(elements, options, reviver, doc, localClipPaths);
  const instances = await elementParser.parse();
  return {
    objects: instances,
    elements,
    options,
    allElements: descendants
  };
}

export { createEmptyResponse, parseSVGDocument };
//# sourceMappingURL=parseSVGDocument.mjs.map

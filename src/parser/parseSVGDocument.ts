// @ts-nocheck
import { applyViewboxTransform } from './applyViewboxTransform';
import { svgInvalidAncestorsRegEx, svgValidTagNamesRegEx } from './constants';
import { hasAncestorWithNodeName } from './hasAncestorWithNodeName';
import { parseUseDirectives } from './parseUseDirectives';
import type { SVGParsingOutput, TSvgReviverCallback } from './typedefs';
import type { LoadImageOptions } from '../util/misc/objectEnlive';
import { ElementsParser } from './elements_parser';

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

export const createEmptyResponse = (): SVGParsingOutput => ({
  objects: [],
  elements: [],
  options: {},
  allElements: [],
});

export async function parseSVGDocument(
  doc: HTMLElement,
  reviver?: TSvgReviverCallback,
  { crossOrigin, signal }: LoadImageOptions = {}
): Promise<SVGParsingOutput> {
  if (signal && signal.aborted) {
    console.log('`options.signal` is in `aborted` state');
    // this is an unhappy path, we dont care about speed
    return createEmptyResponse();
  }
  parseUseDirectives(doc);

  const descendants = Array.from(doc.getElementsByTagName('*')),
    options = {
      ...applyViewboxTransform(doc),
      crossOrigin,
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
    return {
      ...createEmptyResponse(),
      options,
      allElements: descendants,
    };
  }
  const localClipPaths: Record<string, Element[]> = {};
  descendants
    .filter((el) => el.nodeName.replace('svg:', '') === 'clipPath')
    .forEach((el) => {
      const id = el.getAttribute('id')!;
      localClipPaths[id] = Array.from(el.getElementsByTagName('*')).filter(
        (el) => svgValidTagNamesRegEx.test(el.nodeName.replace('svg:', ''))
      );
    });

  // Precedence of rules:   style > class > attribute
  const elementParser = new ElementsParser(
    elements,
    options,
    reviver,
    {
      crossOrigin,
      signal,
    },
    doc,
    localClipPaths
  );

  const instances = await elementParser.parse();

  return {
    objects: instances,
    elements,
    options,
    allElements: descendants,
  };
}

import {
  ElementsParser,
  ElementsParserOptions,
  ElementsParserParsingOptions,
  TElementsParserCallback,
  TReviver
} from './elements_parser';
import {TParsedViewBoxDims} from "./applyViewboxTransform";

/**
 * Transforms an array of svg elements to corresponding fabric.* instances
 * @static
 * @memberOf fabric
 * @param {Array} elements Array of elements to parse
 * @param {Function} callback Being passed an array of fabric instances (transformed from SVG elements)
 * @param {Object} [options] Options object
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 * @param parsingOptions
 * @param doc
 */
export function parseElements(
  elements: Element[],
  callback: TElementsParserCallback,
  options: ElementsParserOptions,
  reviver: TReviver,
  parsingOptions: ElementsParserParsingOptions,
  doc?: Document
) {
  new ElementsParser(
    elements,
    callback,
    options,
    reviver,
    parsingOptions,
    doc
  ).parse();
}

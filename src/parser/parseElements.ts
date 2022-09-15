//@ts-nocheck

import { ElementsParser } from './elements_parser';

/**
 * Transforms an array of svg elements to corresponding fabric.* instances
 * @static
 * @memberOf fabric
 * @param {Array} elements Array of elements to parse
 * @param {Function} callback Being passed an array of fabric instances (transformed from SVG elements)
 * @param {Object} [options] Options object
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 */
export function parseElements(
  elements,
  callback,
  options,
  reviver,
  parsingOptions
) {
  new ElementsParser(
    elements,
    callback,
    options,
    reviver,
    parsingOptions
  ).parse();
}

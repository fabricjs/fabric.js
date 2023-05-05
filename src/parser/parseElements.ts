//@ts-nocheck

import { ElementsParser } from './elements_parser';

/**
 * Transforms an array of svg elements to corresponding fabric.* instances
 * @static
 * @memberOf fabric
 * @param {Array} elements Array of elements to parse
 * @param {Object} [options] Options object
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 */
export function parseElements(elements, options, reviver, parsingOptions) {
  return new ElementsParser(elements, options, reviver, parsingOptions).parse();
}

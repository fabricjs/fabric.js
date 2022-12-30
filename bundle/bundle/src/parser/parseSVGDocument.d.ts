/**
 * Parses an SVG document, converts it to an array of corresponding fabric.* instances and passes them to a callback
 * @static
 * @function
 * @memberOf fabric
 * @param {SVGDocument} doc SVG document to parse
 * @param {Function} callback Callback to call when parsing is finished;
 * It's being passed an array of elements (parsed from a document).
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 * @param {Object} [parsingOptions] options for parsing document
 * @param {String} [parsingOptions.crossOrigin] crossOrigin settings
 * @param {AbortSignal} [parsingOptions.signal] see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
export declare function parseSVGDocument(doc: any, callback: any, reviver: any, parsingOptions: any): void;
//# sourceMappingURL=parseSVGDocument.d.ts.map
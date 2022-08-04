//@ts-nocheck
import { extend, toArray } from '../util';
import { applyViewboxTransform } from "./applyViewboxTransform";
import { clipPaths, cssRules, gradientDefs, svgInvalidAncestorsRegEx, svgValidParentsRegEx, svgValidTagNamesRegEx, svgViewBoxElementsRegEx } from "./constants";
import { elementById } from "./elementById";
import { getCSSRules } from './getCSSRules';
import { getGradientDefs } from './getGradientDefs';
import { getMultipleNodes } from "./getMultipleNodes";
import { hasAncestorWithNodeName } from "./hasAncestorWithNodeName";
import { loadSVGFromString } from './loadSVGFromString';
import { loadSVGFromURL } from './loadSVGFromURL';
import { parseAttributes } from "./parseAttributes";
import { parseElements } from './parseElements';
import { parseFontDeclaration } from "./parseFontDeclaration";
import { parsePointsAttribute } from "./parsePointsAttribute";
import { parseStyleAttribute } from "./parseStyleAttribute";
import { parseTransformAttribute } from "./parseTransformAttribute";
import { parseUseDirectives } from "./parseUseDirectives";


(function (global) {
  /**
   * @name fabric
   * @namespace
   */

  var fabric = global.fabric || (global.fabric = {});



  fabric.svgValidTagNamesRegEx = svgValidTagNamesRegEx;
  fabric.svgViewBoxElementsRegEx = svgViewBoxElementsRegEx;
  fabric.svgInvalidAncestorsRegEx = svgInvalidAncestorsRegEx;
  fabric.svgValidParentsRegEx = svgValidParentsRegEx;

  fabric.cssRules = cssRules;
  fabric.gradientDefs = gradientDefs;
  fabric.clipPaths = clipPaths;


  /**
   * Parses "transform" attribute, returning an array of values
   * @static
   * @function
   * @memberOf fabric
   * @param {String} attributeValue String containing attribute value
   * @return {Array} Array of 6 elements representing transformation matrix
   */
  fabric.parseTransformAttribute = parseTransformAttribute;


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
  fabric.parseSVGDocument = function (doc, callback, reviver, parsingOptions) {
    if (!doc) {
      return;
    }
    if (parsingOptions && parsingOptions.signal && parsingOptions.signal.aborted) {
      throw new Error('`options.signal` is in `aborted` state');
    }
    parseUseDirectives(doc);

    var svgUid = fabric.Object.__uid++, i, len,
      options = applyViewboxTransform(doc),
      descendants = toArray(doc.getElementsByTagName('*'));
    options.crossOrigin = parsingOptions && parsingOptions.crossOrigin;
    options.svgUid = svgUid;
    options.signal = parsingOptions && parsingOptions.signal;

    if (descendants.length === 0 && isLikelyNode) {
      // we're likely in node, where "o3-xml" library fails to gEBTN("*")
      // https://github.com/ajaxorg/node-o3-xml/issues/21
      descendants = doc.selectNodes('//*[name(.)!="svg"]');
      var arr = [];
      for (i = 0, len = descendants.length; i < len; i++) {
        arr[i] = descendants[i];
      }
      descendants = arr;
    }

    var elements = descendants.filter(function (el) {
      applyViewboxTransform(el);
      return svgValidTagNamesRegEx.test(el.nodeName.replace('svg:', '')) &&
        !hasAncestorWithNodeName(el, svgInvalidAncestorsRegEx); // http://www.w3.org/TR/SVG/struct.html#DefsElement
    });
    if (!elements || (elements && !elements.length)) {
      callback && callback([], {});
      return;
    }
    var clipPaths = {};
    descendants.filter(function (el) {
      return el.nodeName.replace('svg:', '') === 'clipPath';
    }).forEach(function (el) {
      var id = el.getAttribute('id');
      clipPaths[id] = toArray(el.getElementsByTagName('*')).filter(function (el) {
        return svgValidTagNamesRegEx.test(el.nodeName.replace('svg:', ''));
      });
    });
    fabric.gradientDefs[svgUid] = fabric.getGradientDefs(doc);
    fabric.cssRules[svgUid] = fabric.getCSSRules(doc);
    fabric.clipPaths[svgUid] = clipPaths;
    // Precedence of rules:   style > class > attribute
    fabric.parseElements(elements, function (instances, elements) {
      if (callback) {
        callback(instances, options, elements, descendants);
        delete fabric.gradientDefs[svgUid];
        delete fabric.cssRules[svgUid];
        delete fabric.clipPaths[svgUid];
      }
    }, Object.assign({}, options), reviver, parsingOptions);
  };

  function recursivelyParseGradientsXlink(doc, gradient) {
    var gradientsAttrs = ['gradientTransform', 'x1', 'x2', 'y1', 'y2', 'gradientUnits', 'cx', 'cy', 'r', 'fx', 'fy'],
      xlinkAttr = 'xlink:href',
      xLink = gradient.getAttribute(xlinkAttr).slice(1),
      referencedGradient = elementById(doc, xLink);
    if (referencedGradient && referencedGradient.getAttribute(xlinkAttr)) {
      recursivelyParseGradientsXlink(doc, referencedGradient);
    }
    gradientsAttrs.forEach(function (attr) {
      if (referencedGradient && !gradient.hasAttribute(attr) && referencedGradient.hasAttribute(attr)) {
        gradient.setAttribute(attr, referencedGradient.getAttribute(attr));
      }
    });
    if (!gradient.children.length) {
      var referenceClone = referencedGradient.cloneNode(true);
      while (referenceClone.firstChild) {
        gradient.appendChild(referenceClone.firstChild);
      }
    }
    gradient.removeAttribute(xlinkAttr);
  }



  extend(fabric, {

    parseFontDeclaration,


    getGradientDefs,


    parseAttributes,

    /**
     * Transforms an array of svg elements to corresponding fabric.* instances
     * @static
     * @memberOf fabric
     * @param {Array} elements Array of elements to parse
     * @param {Function} callback Being passed an array of fabric instances (transformed from SVG elements)
     * @param {Object} [options] Options object
     * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
     */
    parseElements,

    parseStyleAttribute,

    parsePointsAttribute,

    getCSSRules,


    loadSVGFromURL,

    loadSVGFromString
  });

})(typeof exports !== 'undefined' ? exports : window);

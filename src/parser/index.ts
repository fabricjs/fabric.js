//@ts-nocheck
import { extend, toArray } from '../util';
import { applyViewboxTransform } from "./applyViewboxTransform";
import { clipPaths, cssRules, gradientDefs, svgInvalidAncestorsRegEx, svgValidParentsRegEx, svgValidTagNamesRegEx, svgViewBoxElementsRegEx } from "./constants";
import { elementById } from "./elementById";
import { getMultipleNodes } from "./getMultipleNodes";
import { hasAncestorWithNodeName } from "./hasAncestorWithNodeName";
import { parseAttributes } from "./parseAttributes";
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
    /**
     * Parses a short font declaration, building adding its properties to a style object
     * @static
     * @function
     * @memberOf fabric
     * @param {String} value font declaration
     * @param {Object} oStyle definition
     */
    parseFontDeclaration,

    /**
     * Parses an SVG document, returning all of the gradient declarations found in it
     * @static
     * @function
     * @memberOf fabric
     * @param {SVGDocument} doc SVG document to parse
     * @return {Object} Gradient definitions; key corresponds to element id, value -- to gradient definition element
     */
    getGradientDefs: function (doc) {
      var tagArray = [
        'linearGradient',
        'radialGradient',
        'svg:linearGradient',
        'svg:radialGradient'],
        elList = getMultipleNodes(doc, tagArray),
        el, j = 0, gradientDefs = {};
      j = elList.length;
      while (j--) {
        el = elList[j];
        if (el.getAttribute('xlink:href')) {
          recursivelyParseGradientsXlink(doc, el);
        }
        gradientDefs[el.getAttribute('id')] = el;
      }
      return gradientDefs;
    },

    /**
     * Returns an object of attributes' name/value, given element and an array of attribute names;
     * Parses parent "g" nodes recursively upwards.
     * @static
     * @memberOf fabric
     * @param {DOMElement} element Element to parse
     * @param {Array} attributes Array of attributes to parse
     * @return {Object} object containing parsed attributes' names/values
     */
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
    parseElements: function (elements, callback, options, reviver, parsingOptions) {
      new fabric.ElementsParser(elements, callback, options, reviver, parsingOptions).parse();
    },

    /**
     * Parses "style" attribute, retuning an object with values
     * @static
     * @memberOf fabric
     * @param {SVGElement} element Element to parse
     * @return {Object} Objects with values parsed from style attribute of an element
     */
    parseStyleAttribute,

    /**
     * Parses "points" attribute, returning an array of values
     * @static
     * @memberOf fabric
     * @param {String} points points attribute string
     * @return {Array} array of points
     */
    parsePointsAttribute,

    /**
     * Returns CSS rules for a given SVG document
     * @static
     * @function
     * @memberOf fabric
     * @param {SVGDocument} doc SVG document to parse
     * @return {Object} CSS rules of this document
     */
    getCSSRules: function (doc) {
      var styles = doc.getElementsByTagName('style'), i, len,
        allRules = {}, rules;

      // very crude parsing of style contents
      for (i = 0, len = styles.length; i < len; i++) {
        var styleContents = styles[i].textContent;

        // remove comments
        styleContents = styleContents.replace(/\/\*[\s\S]*?\*\//g, '');
        if (styleContents.trim() === '') {
          continue;
        }
        // recovers all the rule in this form `body { style code... }`
        // rules = styleContents.match(/[^{]*\{[\s\S]*?\}/g);
        rules = styleContents.split('}');
        // remove empty rules.
        rules = rules.filter(function (rule) { return rule.trim(); });
        // at this point we have hopefully an array of rules `body { style code... `
        // eslint-disable-next-line no-loop-func
        rules.forEach(function (rule) {

          var match = rule.split('{'),
            ruleObj = {}, declaration = match[1].trim(),
            propertyValuePairs = declaration.split(';').filter(function (pair) { return pair.trim(); });

          for (i = 0, len = propertyValuePairs.length; i < len; i++) {
            var pair = propertyValuePairs[i].split(':'),
              property = pair[0].trim(),
              value = pair[1].trim();
            ruleObj[property] = value;
          }
          rule = match[0].trim();
          rule.split(',').forEach(function (_rule) {
            _rule = _rule.replace(/^svg/i, '').trim();
            if (_rule === '') {
              return;
            }
            if (allRules[_rule]) {
              Object.assign(allRules[_rule], ruleObj);
            }
            else {
              allRules[_rule] = Object.assign({}, ruleObj);
            }
          });
        });
      }
      return allRules;
    },

    /**
     * Takes url corresponding to an SVG document, and parses it into a set of fabric objects.
     * Note that SVG is fetched via XMLHttpRequest, so it needs to conform to SOP (Same Origin Policy)
     * @memberOf fabric
     * @param {String} url
     * @param {Function} callback
     * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
     * @param {Object} [options] Object containing options for parsing
     * @param {String} [options.crossOrigin] crossOrigin crossOrigin setting to use for external resources
     * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     */
    loadSVGFromURL: function (url, callback, reviver, options) {

      url = url.replace(/^\n\s*/, '').trim();
      new request(url, {
        method: 'get',
        onComplete: onComplete,
        signal: options && options.signal
      });

      function onComplete(r) {

        var xml = r.responseXML;
        if (!xml || !xml.documentElement) {
          callback && callback(null);
          return false;
        }

        fabric.parseSVGDocument(xml.documentElement, function (results, _options, elements, allElements) {
          callback && callback(results, _options, elements, allElements);
        }, reviver, options);
      }
    },

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
    loadSVGFromString: function (string, callback, reviver, options) {
      var parser = new fabric.window.DOMParser(),
        doc = parser.parseFromString(string.trim(), 'text/xml');
      fabric.parseSVGDocument(doc.documentElement, function (results, _options, elements, allElements) {
        callback(results, _options, elements, allElements);
      }, reviver, options);
    }
  });

})(typeof exports !== 'undefined' ? exports : window);

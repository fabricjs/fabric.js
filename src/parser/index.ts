//@ts-nocheck
import { fabric } from '../../HEADER';
import { extend } from '../util';
import { clipPaths, cssRules, gradientDefs, svgInvalidAncestorsRegEx, svgValidParentsRegEx, svgValidTagNamesRegEx, svgViewBoxElementsRegEx } from "./constants";
import { getCSSRules } from './getCSSRules';
import { getGradientDefs } from './getGradientDefs';
import { loadSVGFromString } from './loadSVGFromString';
import { loadSVGFromURL } from './loadSVGFromURL';
import { parseAttributes } from "./parseAttributes";
import { parseElements } from './parseElements';
import { parseFontDeclaration } from "./parseFontDeclaration";
import { parsePointsAttribute } from "./parsePointsAttribute";
import { parseStyleAttribute } from "./parseStyleAttribute";
import { parseSVGDocument } from './parseSVGDocument';
import { parseTransformAttribute } from "./parseTransformAttribute";




  fabric.svgValidTagNamesRegEx = svgValidTagNamesRegEx;
  fabric.svgViewBoxElementsRegEx = svgViewBoxElementsRegEx;
  fabric.svgInvalidAncestorsRegEx = svgInvalidAncestorsRegEx;
  fabric.svgValidParentsRegEx = svgValidParentsRegEx;

  fabric.cssRules = cssRules;
  fabric.gradientDefs = gradientDefs;
  fabric.clipPaths = clipPaths;

  fabric.parseTransformAttribute = parseTransformAttribute;


  fabric.parseSVGDocument = parseSVGDocument



  extend(fabric, {

    parseFontDeclaration,


    getGradientDefs,


    parseAttributes,

    parseElements,

    parseStyleAttribute,

    parsePointsAttribute,

    getCSSRules,


    loadSVGFromURL,

    loadSVGFromString
  });


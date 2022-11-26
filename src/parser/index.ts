import { fabric } from '../../HEADER';
import { SHARED_ATTRIBUTES } from './attributes';
import { clipPaths, cssRules, gradientDefs } from './constants';
import { ElementsParser } from './elements_parser';
import { getCSSRules } from './getCSSRules';
import { getGradientDefs } from './getGradientDefs';
import { loadSVGFromString } from './loadSVGFromString';
import { loadSVGFromURL } from './loadSVGFromURL';
import { parseAttributes } from './parseAttributes';
import { parseElements } from './parseElements';
import { parseFontDeclaration } from './parseFontDeclaration';
import { parsePointsAttribute } from './parsePointsAttribute';
import { parseStyleAttribute } from './parseStyleAttribute';
import { parseSVGDocument } from './parseSVGDocument';
import { parseTransformAttribute } from './parseTransformAttribute';

Object.assign(fabric, {
  SHARED_ATTRIBUTES,
  cssRules,
  gradientDefs,
  clipPaths,
  parseTransformAttribute,
  parseSVGDocument,
  parseFontDeclaration,
  getGradientDefs,
  parseAttributes,
  parseElements,
  parseStyleAttribute,
  parsePointsAttribute,
  getCSSRules,
  loadSVGFromURL,
  loadSVGFromString,
  ElementsParser,
});

//@ts-nocheck
import { getSvgRegex } from './getSvgRegex';

export const cssRules = {};
export const gradientDefs = {};
export const clipPaths = {};

export const storage = {
  cssRules,
  gradientDefs,
  clipPaths,
};

export const reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)';

export const svgNS = 'http://www.w3.org/2000/svg';

export const commaWsp = '(?:\\s+,?\\s*|,\\s*)';

export const rePathCommand =
  /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/gi;

export const reFontDeclaration = new RegExp(
  '(normal|italic)?\\s*(normal|small-caps)?\\s*' +
    '(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(' +
    reNum +
    '(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|' +
    reNum +
    '))?\\s+(.*)'
);

export const svgValidTagNames = [
    'path',
    'circle',
    'polygon',
    'polyline',
    'ellipse',
    'rect',
    'line',
    'image',
    'text',
  ],
  svgViewBoxElements = ['symbol', 'image', 'marker', 'pattern', 'view', 'svg'],
  svgInvalidAncestors = [
    'pattern',
    'defs',
    'symbol',
    'metadata',
    'clipPath',
    'mask',
    'desc',
  ],
  svgValidParents = ['symbol', 'g', 'a', 'svg', 'clipPath', 'defs'],
  attributesMap = {
    cx: 'left',
    x: 'left',
    r: 'radius',
    cy: 'top',
    y: 'top',
    display: 'visible',
    visibility: 'visible',
    transform: 'transformMatrix',
    'fill-opacity': 'fillOpacity',
    'fill-rule': 'fillRule',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-style': 'fontStyle',
    'font-weight': 'fontWeight',
    'letter-spacing': 'charSpacing',
    'paint-order': 'paintFirst',
    'stroke-dasharray': 'strokeDashArray',
    'stroke-dashoffset': 'strokeDashOffset',
    'stroke-linecap': 'strokeLineCap',
    'stroke-linejoin': 'strokeLineJoin',
    'stroke-miterlimit': 'strokeMiterLimit',
    'stroke-opacity': 'strokeOpacity',
    'stroke-width': 'strokeWidth',
    'text-decoration': 'textDecoration',
    'text-anchor': 'textAnchor',
    opacity: 'opacity',
    'clip-path': 'clipPath',
    'clip-rule': 'clipRule',
    'vector-effect': 'strokeUniform',
    'image-rendering': 'imageSmoothing',
  },
  colorAttributes = {
    stroke: 'strokeOpacity',
    fill: 'fillOpacity',
  },
  fSize = 'font-size',
  cPath = 'clip-path';

export const svgValidTagNamesRegEx = getSvgRegex(svgValidTagNames);

export const svgViewBoxElementsRegEx = getSvgRegex(svgViewBoxElements);

export const svgInvalidAncestorsRegEx = getSvgRegex(svgInvalidAncestors);

export const svgValidParentsRegEx = getSvgRegex(svgValidParents);

// http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute
// matches, e.g.: +14.56e-12, etc.
export const reViewBoxAttrValue = new RegExp(
  '^' +
    '\\s*(' +
    reNum +
    '+)\\s*,?' +
    '\\s*(' +
    reNum +
    '+)\\s*,?' +
    '\\s*(' +
    reNum +
    '+)\\s*,?' +
    '\\s*(' +
    reNum +
    '+)\\s*' +
    '$'
);

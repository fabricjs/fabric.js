import { getSvgRegex } from './getSvgRegex';
import { TGradientDefs } from './getGradientDefs';
import { TCSSRulesCollection } from './getCSSRules';

export type TClipPathCollection = Record<string, Element[]>;

export const cssRules: Record<string, TCSSRulesCollection> = {};
export const gradientDefs: Record<string, TGradientDefs> = {};
export const clipPaths: Record<string, TClipPathCollection> = {};

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

export enum ESVGTag {
  path = 'path',
  circle = 'circle',
  polygon = 'polygon',
  polyline = 'polyline',
  ellipse = 'ellipse',
  rect = 'rect',
  line = 'line',
  image = 'image',
  text = 'text',
}

export enum ESVGViewBoxElement {
  symbol = 'symbol',
  image = 'image',
  marker = 'marker',
  pattern = 'pattern',
  view = 'view',
  svg = 'svg',
}

export enum ESVGInvalidAncestors {
  pattern = 'pattern',
  defs = 'defs',
  symbol = 'symbol',
  metadata = 'metadata',
  clipPath = 'clipPath',
  mask = 'mask',
  desc = 'desc',
}

export enum ESVGValidParents {
  symbol = 'symbol',
  g = 'g',
  a = 'a',
  svg = 'svg',
  clipPath = 'clipPath',
  defs = 'defs',
}

export const svgValidTagNames = Object.values(ESVGTag),
  svgViewBoxElements = Object.values(ESVGViewBoxElement),
  svgInvalidAncestors = Object.values(ESVGInvalidAncestors),
  svgValidParents = Object.values(ESVGValidParents),
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

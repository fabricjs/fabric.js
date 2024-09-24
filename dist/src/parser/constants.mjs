import { taggedTemplateLiteral as _taggedTemplateLiteral } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { getSvgRegex } from './getSvgRegex.mjs';
import { LEFT, TOP } from '../constants.mjs';

var _templateObject;
const reNum = String.raw(_templateObject || (_templateObject = _taggedTemplateLiteral(["(?:[-+]?(?:d*.d+|d+.?)(?:[eE][-+]?d+)?)"], ["(?:[-+]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][-+]?\\d+)?)"])));
const svgNS = 'http://www.w3.org/2000/svg';
const reFontDeclaration = new RegExp('(normal|italic)?\\s*(normal|small-caps)?\\s*' + '(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(' + reNum + '(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|' + reNum + '))?\\s+(.*)');
const svgValidTagNames = ['path', 'circle', 'polygon', 'polyline', 'ellipse', 'rect', 'line', 'image', 'text'],
  svgViewBoxElements = ['symbol', 'image', 'marker', 'pattern', 'view', 'svg'],
  svgInvalidAncestors = ['pattern', 'defs', 'symbol', 'metadata', 'clipPath', 'mask', 'desc'],
  svgValidParents = ['symbol', 'g', 'a', 'svg', 'clipPath', 'defs'],
  attributesMap = {
    cx: LEFT,
    x: LEFT,
    r: 'radius',
    cy: TOP,
    y: TOP,
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
    'image-rendering': 'imageSmoothing'
  },
  fSize = 'font-size',
  cPath = 'clip-path';
const svgValidTagNamesRegEx = getSvgRegex(svgValidTagNames);
const svgViewBoxElementsRegEx = getSvgRegex(svgViewBoxElements);
const svgValidParentsRegEx = getSvgRegex(svgValidParents);

// http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute
// matches, e.g.: +14.56e-12, etc.
const reViewBoxAttrValue = new RegExp('^' + '\\s*(' + reNum + '+)\\s*,?' + '\\s*(' + reNum + '+)\\s*,?' + '\\s*(' + reNum + '+)\\s*,?' + '\\s*(' + reNum + '+)\\s*' + '$');

export { attributesMap, cPath, fSize, reFontDeclaration, reNum, reViewBoxAttrValue, svgInvalidAncestors, svgNS, svgValidParents, svgValidParentsRegEx, svgValidTagNames, svgValidTagNamesRegEx, svgViewBoxElements, svgViewBoxElementsRegEx };
//# sourceMappingURL=constants.mjs.map

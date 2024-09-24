import { STROKE, FILL, reNewline, LEFT } from '../../constants.mjs';

const fontProperties = ['fontSize', 'fontWeight', 'fontFamily', 'fontStyle'];
const textDecorationProperties = ['underline', 'overline', 'linethrough'];
const textLayoutProperties = [...fontProperties, 'lineHeight', 'text', 'charSpacing', 'textAlign', 'styles', 'path', 'pathStartOffset', 'pathSide', 'pathAlign'];
const additionalProps = [...textLayoutProperties, ...textDecorationProperties, 'textBackgroundColor', 'direction'];
const styleProperties = [...fontProperties, ...textDecorationProperties, STROKE, 'strokeWidth', FILL, 'deltaY', 'textBackgroundColor'];

// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
const textDefaultValues = {
  _reNewline: reNewline,
  _reSpacesAndTabs: /[ \t\r]/g,
  _reSpaceAndTab: /[ \t\r]/,
  _reWords: /\S+/g,
  fontSize: 40,
  fontWeight: 'normal',
  fontFamily: 'Times New Roman',
  underline: false,
  overline: false,
  linethrough: false,
  textAlign: LEFT,
  fontStyle: 'normal',
  lineHeight: 1.16,
  superscript: {
    size: 0.6,
    // fontSize factor
    baseline: -0.35 // baseline-shift factor (upwards)
  },
  subscript: {
    size: 0.6,
    // fontSize factor
    baseline: 0.11 // baseline-shift factor (downwards)
  },
  textBackgroundColor: '',
  stroke: null,
  shadow: null,
  path: undefined,
  pathStartOffset: 0,
  pathSide: LEFT,
  pathAlign: 'baseline',
  _fontSizeFraction: 0.222,
  offsets: {
    underline: 0.1,
    linethrough: -0.315,
    overline: -0.88
  },
  _fontSizeMult: 1.13,
  charSpacing: 0,
  deltaY: 0,
  direction: 'ltr',
  CACHE_FONT_SIZE: 400,
  MIN_TEXT_WIDTH: 2
};
const JUSTIFY = 'justify';
const JUSTIFY_LEFT = 'justify-left';
const JUSTIFY_RIGHT = 'justify-right';
const JUSTIFY_CENTER = 'justify-center';

export { JUSTIFY, JUSTIFY_CENTER, JUSTIFY_LEFT, JUSTIFY_RIGHT, additionalProps, styleProperties, textDecorationProperties, textDefaultValues, textLayoutProperties };
//# sourceMappingURL=constants.mjs.map

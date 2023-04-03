import { TClassProperties } from '../../typedefs';
import type { Text } from './Text';

const fontProperties = [
  'fontSize',
  'fontWeight',
  'fontFamily',
  'fontStyle',
] as const;

const textDecorationProperties = [
  'underline',
  'overline',
  'linethrough',
] as const;

export const textLayoutProperties: string[] = [
  ...fontProperties,
  'lineHeight',
  'text',
  'charSpacing',
  'textAlign',
  'styles',
  'path',
  'pathStartOffset',
  'pathSide',
  'pathAlign',
];

export const additionalProps = [
  ...textLayoutProperties,
  ...textDecorationProperties,
  'textBackgroundColor',
  'direction',
] as const;

export const styleProperties = [
  ...fontProperties,
  ...textDecorationProperties,
  'stroke',
  'strokeWidth',
  'fill',
  'deltaY',
  'textBackgroundColor',
] as const;

// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
export const textDefaultValues: Partial<TClassProperties<Text>> = {
  _reNewline: /\r?\n/,
  _reSpacesAndTabs: /[ \t\r]/g,
  _reSpaceAndTab: /[ \t\r]/,
  _reWords: /\S+/g,
  fontSize: 40,
  fontWeight: 'normal',
  fontFamily: 'Times New Roman',
  underline: false,
  overline: false,
  linethrough: false,
  textAlign: 'left',
  fontStyle: 'normal',
  lineHeight: 1.16,
  superscript: {
    size: 0.6, // fontSize factor
    baseline: -0.35, // baseline-shift factor (upwards)
  },
  subscript: {
    size: 0.6, // fontSize factor
    baseline: 0.11, // baseline-shift factor (downwards)
  },
  textBackgroundColor: '',
  stroke: null,
  shadow: null,
  path: null,
  pathStartOffset: 0,
  pathSide: 'left',
  pathAlign: 'baseline',
  _fontSizeFraction: 0.222,
  offsets: {
    underline: 0.1,
    linethrough: -0.315,
    overline: -0.88,
  },
  _fontSizeMult: 1.13,
  charSpacing: 0,
  deltaY: 0,
  direction: 'ltr',
  CACHE_FONT_SIZE: 400,
  MIN_TEXT_WIDTH: 2,
};

import { FILL, LEFT, LTR, NORMAL, STROKE, reNewline } from '../../constants';
import type { TClassProperties } from '../../typedefs';
import type { FabricText } from './Text';

export const TEXT_DECORATION_THICKNESS = 'textDecorationThickness';

const fontProperties = [
  'fontSize',
  'fontWeight',
  'fontFamily',
  'fontStyle',
] as const;

export const textDecorationProperties = [
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
  TEXT_DECORATION_THICKNESS,
] as const;

export type StylePropertiesType =
  | 'fill'
  | 'stroke'
  | 'strokeWidth'
  | 'fontSize'
  | 'fontFamily'
  | 'fontWeight'
  | 'fontStyle'
  | 'textBackgroundColor'
  | 'deltaY'
  | 'overline'
  | 'underline'
  | 'linethrough'
  | typeof TEXT_DECORATION_THICKNESS;

export const styleProperties: Readonly<StylePropertiesType[]> = [
  ...fontProperties,
  ...textDecorationProperties,
  STROKE,
  'strokeWidth',
  FILL,
  'deltaY',
  'textBackgroundColor',
  TEXT_DECORATION_THICKNESS,
] as const;

// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
export const textDefaultValues: Partial<TClassProperties<FabricText>> = {
  _reNewline: reNewline,
  _reSpacesAndTabs: /[ \t\r]/g,
  _reSpaceAndTab: /[ \t\r]/,
  _reWords: /\S+/g,
  fontSize: 40,
  fontWeight: NORMAL,
  fontFamily: 'Times New Roman',
  underline: false,
  overline: false,
  linethrough: false,
  textAlign: LEFT,
  fontStyle: NORMAL,
  lineHeight: 1.16,
  textBackgroundColor: '',
  stroke: null,
  shadow: null,
  path: undefined,
  pathStartOffset: 0,
  pathSide: LEFT,
  pathAlign: 'baseline',
  charSpacing: 0,
  deltaY: 0,
  direction: LTR,
  CACHE_FONT_SIZE: 400,
  MIN_TEXT_WIDTH: 2,
  // Text magic numbers
  superscript: {
    size: 0.6, // fontSize factor
    baseline: -0.35, // baseline-shift factor (upwards)
  },
  subscript: {
    size: 0.6, // fontSize factor
    baseline: 0.11, // baseline-shift factor (downwards)
  },
  _fontSizeFraction: 0.222,
  offsets: {
    underline: 0.1,
    linethrough: -0.28167, // added 1/30 to original number
    overline: -0.81333, // added 1/15 to original number
  },
  _fontSizeMult: 1.13,
  [TEXT_DECORATION_THICKNESS]: 66.667, // before implementation was 1/15
};

export const JUSTIFY = 'justify';
export const JUSTIFY_LEFT = 'justify-left';
export const JUSTIFY_RIGHT = 'justify-right';
export const JUSTIFY_CENTER = 'justify-center';

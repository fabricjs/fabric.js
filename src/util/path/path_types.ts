import { IPoint, Point } from '../../point.class';
import { TRadian } from '../../typedefs';
import { commaWsp } from '../../parser/constants';

type TPathSegmentInfoCommon = {
  x: number;
  y: number;
  command?: string;
  length: number;
};

export type TCurveInfo = TPathSegmentInfoCommon & {
  /**
   * Get the Point a certain percent distance along the curve
   * @param pct
   */
  iterator: (pct: number) => Point;
  /**
   * Get the angle to a percent
   * @param pct
   */
  angleFinder: (pct: number) => number;
  /**
   * Total length of the curve
   */
  length: number;
};

/**
 * Info about various paths
 */
export type TPathSegmentInfo = {
  M: TPathSegmentInfoCommon;
  L: TPathSegmentInfoCommon;
  C: TCurveInfo;
  Q: TCurveInfo;
  Z: TPathSegmentInfoCommon & { destX: number; destY: number };
};

export type TPathSegmentsInfo = TPathSegmentInfo[keyof TPathSegmentInfo];

/**
 * A parsed command of any length (even impossible ones)
 */
export type TParsedCommand =
  | [command: string]
  | [command: string, arg1: number]
  | [command: string, arg1: number, arg2: number]
  | [command: string, arg1: number, arg2: number, arg3: number]
  | [command: string, arg1: number, arg2: number, arg3: number, arg4: number]
  | [
      command: string,
      arg1: number,
      arg2: number,
      arg3: number,
      arg4: number,
      arg5: number
    ]
  | [
      command: string,
      arg1: number,
      arg2: number,
      arg3: number,
      arg4: number,
      arg5: number,
      arg6: number
    ]
  | [
      command: string,
      arg1: number,
      arg2: number,
      arg3: number,
      arg4: number,
      arg5: number,
      arg6: number,
      arg7: number
    ];

/**
 * Command strings of any length
 */
type TCommand1<T extends TParsedCommand> = `${T[0]}`;
type TCommand2<T extends TParsedCommand> = `${T[0]} ${T[1]}`;
type TCommand3<T extends TParsedCommand> = `${T[0]} ${T[1]} ${T[2]}`;
type TCommand4<T extends TParsedCommand> = `${T[0]} ${T[1]} ${T[2]} ${T[3]}`;
type TCommand5<T extends TParsedCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]}`;
type TCommand6<T extends TParsedCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]} ${T[5]}`;
type TCommand7<T extends TParsedCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]} ${T[5]} ${T[6]}`;
type TCommand8<T extends TParsedCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]} ${T[5]} ${T[6]} ${T[7]}`;

// absolute value number
const absNumberRegExStr = String.raw`(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?`;
export const numberRegExStr = String.raw`[-+]?${absNumberRegExStr}`;

/**
 * p for param
 * using "bad naming" here because it makes the regex much easier to read
 */
const p = String.raw`(${numberRegExStr})`;

/**
 * Begin parsed SVG path commands
 * Read about commands at {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths|MDN}
 */
export type TParsedAbsoluteMoveToCommand = [command: 'M', x: number, y: number];
export type TParsedRelativeMoveToCommand = [
  command: 'm',
  dx: number,
  dy: number
];
export type TParsedMoveToCommand =
  | TParsedAbsoluteMoveToCommand
  | TParsedRelativeMoveToCommand;

export type TMoveToCommand = TCommand3<TParsedMoveToCommand>;
export const reMoveToCommand = new RegExp(String.raw`(M) (?:${p} ${p} ?)+`, 'gi');

export type TParsedAbsoluteLineCommand = [command: 'L', x: number, y: number];
export type TParsedRelativeLineCommand = [command: 'l', dx: number, dy: number];
export type TParsedLineCommand =
  | TParsedAbsoluteLineCommand
  | TParsedRelativeLineCommand;

export type TLineCommand = TCommand3<TParsedLineCommand>;
export const reLineCommand = new RegExp(String.raw`(L) (?:${p} ${p} ?)+`, 'gi');

export type TParsedAbsoluteHorizontalLineCommand = [command: 'H', x: number];
export type TParsedRelativeHorizontalLineCommand = [command: 'h', dx: number];
export type TParsedHorizontalLineCommand =
  | TParsedAbsoluteHorizontalLineCommand
  | TParsedRelativeHorizontalLineCommand;

export type THorizontalLineCommand = TCommand2<TParsedHorizontalLineCommand>;
export const reHorizontalLineCommand = new RegExp(
  String.raw`(H) (?:${p} ?)+`,
  'gi'
);

export type TParsedAbsoluteVerticalLineCommand = [command: 'V', y: number];
export type TParsedRelativeVerticalLineCommand = [command: 'v', dy: number];
export type TParsedVerticalLineCommand =
  | TParsedAbsoluteVerticalLineCommand
  | TParsedRelativeVerticalLineCommand;

export type TVerticalLineCommand = TCommand2<TParsedVerticalLineCommand>;
export const reVerticalLineCommand = new RegExp(
  String.raw`(V) (?:${p} ?)+`,
  'gi'
);

export type TParsedAbsoluteClosePathCommand = [command: 'Z'];
export type TParsedRelativeClosePathCommand = [command: 'z'];
export type TParsedClosePathCommand =
  | TParsedAbsoluteClosePathCommand
  | TParsedRelativeClosePathCommand;

export type TClosePathCommand = TCommand1<TParsedClosePathCommand>;
export const reClosePathCommand = new RegExp(String.raw`(Z)\s*`, 'gi');

export type TParsedAbsoluteCubicCurveCommand = [
  command: 'C',
  controlPoint1X: number,
  controlPoint1Y: number,
  controlPoint2X: number,
  controlPoint2Y: number,
  endX: number,
  endY: number
];
export type TParsedRelativeCubicCurveCommand = [
  command: 'c',
  controlPoint1DX: number,
  controlPoint1DY: number,
  controlPoint2DX: number,
  controlPoint2DY: number,
  endDX: number,
  endDY: number
];
export type TParsedCubicCurveCommand =
  | TParsedAbsoluteCubicCurveCommand
  | TParsedRelativeCubicCurveCommand;

export type TCubicCurveCommand = TCommand7<TParsedCubicCurveCommand>;
export const reCubicCurveCommand = new RegExp(
  String.raw`(C) (?:${p} ${p} ${p} ${p} ${p} ${p} ?)+`,
  'gi'
);

export type TParsedAbsoluteCubicCurveShortcutCommand = [
  command: 'S',
  controlPoint2X: number,
  controlPoint2Y: number,
  endX: number,
  endY: number
];
export type TParsedRelativeCubicCurveShortcutCommand = [
  command: 's',
  controlPoint2DX: number,
  controlPoint2DY: number,
  endDX: number,
  endDY: number
];
export type TParsedCubicCurveShortcutCommand =
  | TParsedAbsoluteCubicCurveShortcutCommand
  | TParsedRelativeCubicCurveShortcutCommand;

export type TCubicCurveShortcutCommand =
  TCommand5<TParsedCubicCurveShortcutCommand>;
export const reCubicCurveShortcutCommand = new RegExp(
  String.raw`(S) (?:${p} ${p} ${p} ${p} ?)+`,
  'gi'
);

export type TParsedAbsoluteQuadraticCurveCommand = [
  command: 'Q',
  controlPointX: number,
  controlPointY: number,
  endX: number,
  endY: number
];
export type TParsedRelativeQuadraticCurveCommand = [
  command: 'q',
  controlPointDX: number,
  controlPointDY: number,
  endDX: number,
  endDY: number
];
export type TParsedQuadraticCurveCommand =
  | TParsedAbsoluteQuadraticCurveCommand
  | TParsedRelativeQuadraticCurveCommand;

export type TQuadraticCurveCommand = TCommand5<TParsedQuadraticCurveCommand>;
export const reQuadraticCurveCommand = new RegExp(
  String.raw`(Q) (?:${p} ${p} ${p} ${p} ?)+`,
  'gi'
);

export type TParsedAbsoluteQuadraticCurveShortcutCommand = [
  command: 'T',
  endX: number,
  endY: number
];
export type TParsedRelativeQuadraticCurveShortcutCommand = [
  command: 't',
  endDX: number,
  endDY: number
];
export type TParsedQuadraticCurveShortcutCommand =
  | TParsedAbsoluteQuadraticCurveShortcutCommand
  | TParsedRelativeQuadraticCurveShortcutCommand;
export const reQuadraticCurveShortcutCommand = new RegExp(
  String.raw`(T) (?:${p} ${p} ?)+`,
  'gi'
);

export type TQuadraticCurveShortcutCommand =
  TCommand3<TParsedQuadraticCurveShortcutCommand>;

export type TParsedAbsoluteArcCommand = [
  command: 'A',
  radiusX: number,
  radiusY: number,
  rotation: TRadian,
  largeArc: 0 | 1,
  sweep: 0 | 1,
  endX: number,
  endY: number
];
export type TParsedRelativeArcCommand = [
  command: 'a',
  radiusX: number,
  radiusY: number,
  rotation: TRadian,
  largeArc: 0 | 1,
  sweep: 0 | 1,
  endDX: number,
  endDY: number
];

export type TParsedArcCommand =
  | TParsedAbsoluteArcCommand
  | TParsedRelativeArcCommand;

export type TArcCommandSingleFlag<T extends TParsedArcCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]}${T[5]} ${T[6]} ${T[7]}`;
export type TArcCommand =
  | TCommand8<TParsedArcCommand>
  | TArcCommandSingleFlag<TParsedArcCommand>;
export const reArcCommand = new RegExp(
  String.raw`(A) (?:${p} ${p} ${p} ([01]) ?([01]) ${p} ${p} ?)+`,
  'gi'
);
/**
 * End parsed path commands
 */

/**
 * Any old valid SVG path command
 */
export type TComplexParsedCommand =
  | TParsedMoveToCommand
  | TParsedLineCommand
  | TParsedHorizontalLineCommand
  | TParsedVerticalLineCommand
  | TParsedClosePathCommand
  | TParsedCubicCurveCommand
  | TParsedCubicCurveShortcutCommand
  | TParsedQuadraticCurveCommand
  | TParsedQuadraticCurveShortcutCommand
  | TParsedArcCommand;

export const rePathCommand = new RegExp(
  `(?:(?:${reMoveToCommand.source})` +
    `|(?:${reLineCommand.source})` +
    `|(?:${reHorizontalLineCommand.source})` +
    `|(?:${reVerticalLineCommand.source})` +
    `|(?:${reClosePathCommand.source})` +
    `|(?:${reCubicCurveCommand.source})` +
    `|(?:${reCubicCurveShortcutCommand.source})` +
    `|(?:${reQuadraticCurveCommand.source})` +
    `|(?:${reQuadraticCurveShortcutCommand.source})` +
    `|(?:${reArcCommand.source}))`,
  'dgi'
);

/**
 * A series of path commands
 */
export type TComplexPathData = TComplexParsedCommand[];

/**
 * Any SVG command that all Fabric functions can understand
 *
 */
export type TSimpleParsedCommand =
  | TParsedAbsoluteMoveToCommand
  | TParsedAbsoluteLineCommand
  | TParsedAbsoluteHorizontalLineCommand
  | TParsedAbsoluteVerticalLineCommand
  | TParsedAbsoluteClosePathCommand
  | TParsedAbsoluteCubicCurveCommand
  | TParsedAbsoluteQuadraticCurveCommand;

/**
 * A series of simple paths
 */
export type TSimplePathData = TSimpleParsedCommand[];

/**
 * A point and the of the vector to the point and the x-axis
 */
export type TPointAngle = IPoint & { angle: TRadian };

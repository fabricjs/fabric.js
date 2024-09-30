import type { TRadian } from '../../typedefs';
import type { XY, Point } from '../../Point';

export type TPathSegmentInfoCommon<C extends string> = {
  x: number;
  y: number;
  command?: C;
  length: number;
};

export type TCurveInfo<C extends string> = TPathSegmentInfoCommon<C> & {
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

export type TEndPathInfo = TPathSegmentInfoCommon<'Z'> & {
  destX: number;
  destY: number;
};

/**
 * Relevant info to calculate path length/points on path
 * for each command type in a simplified parsed path
 */
export type TPathSegmentCommandInfo = {
  M: TPathSegmentInfoCommon<'M'>;
  L: TPathSegmentInfoCommon<'L'>;
  C: TCurveInfo<'C'>;
  Q: TCurveInfo<'Q'>;
  Z: TEndPathInfo;
};

export type TPathSegmentInfo =
  TPathSegmentCommandInfo[keyof TPathSegmentCommandInfo];

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
      arg5: number,
    ]
  | [
      command: string,
      arg1: number,
      arg2: number,
      arg3: number,
      arg4: number,
      arg5: number,
      arg6: number,
    ]
  | [
      command: string,
      arg1: number,
      arg2: number,
      arg3: number,
      arg4: number,
      arg5: number,
      arg6: number,
      arg7: number,
    ];

/**
 * Command strings of any length
 */
type TCommand1<T extends TParsedCommand> = `${T[0]}`;
type TCommand2<T extends TParsedCommand> = `${T[0]} ${T[1]}`;
type TCommand3<T extends TParsedCommand> = `${T[0]} ${T[1]} ${T[2]}`;
type TCommand5<T extends TParsedCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]}`;
type TCommand7<T extends TParsedCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]} ${T[5]} ${T[6]}`;
type TCommand8<T extends TParsedCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]} ${T[5]} ${T[6]} ${T[7]}`;

/**
 * Begin parsed SVG path commands
 * Read about commands at {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths|MDN}
 */
export type TParsedAbsoluteMoveToCommand = [command: 'M', x: number, y: number];
export type TParsedRelativeMoveToCommand = [
  command: 'm',
  dx: number,
  dy: number,
];
export type TParsedMoveToCommand =
  | TParsedAbsoluteMoveToCommand
  | TParsedRelativeMoveToCommand;

export type TMoveToCommand = TCommand3<TParsedMoveToCommand>;

export type TParsedAbsoluteLineCommand = [command: 'L', x: number, y: number];
export type TParsedRelativeLineCommand = [command: 'l', dx: number, dy: number];
export type TParsedLineCommand =
  | TParsedAbsoluteLineCommand
  | TParsedRelativeLineCommand;

export type TLineCommand = TCommand3<TParsedLineCommand>;

export type TParsedAbsoluteHorizontalLineCommand = [command: 'H', x: number];
export type TParsedRelativeHorizontalLineCommand = [command: 'h', dx: number];
export type TParsedHorizontalLineCommand =
  | TParsedAbsoluteHorizontalLineCommand
  | TParsedRelativeHorizontalLineCommand;

export type THorizontalLineCommand = TCommand2<TParsedHorizontalLineCommand>;

export type TParsedAbsoluteVerticalLineCommand = [command: 'V', y: number];
export type TParsedRelativeVerticalLineCommand = [command: 'v', dy: number];
export type TParsedVerticalLineCommand =
  | TParsedAbsoluteVerticalLineCommand
  | TParsedRelativeVerticalLineCommand;

export type TVerticalLineCommand = TCommand2<TParsedVerticalLineCommand>;

export type TParsedAbsoluteClosePathCommand = [command: 'Z'];
export type TParsedRelativeClosePathCommand = [command: 'z'];
export type TParsedClosePathCommand =
  | TParsedAbsoluteClosePathCommand
  | TParsedRelativeClosePathCommand;

export type TClosePathCommand = TCommand1<TParsedClosePathCommand>;

export type TParsedAbsoluteCubicCurveCommand = [
  command: 'C',
  controlPoint1X: number,
  controlPoint1Y: number,
  controlPoint2X: number,
  controlPoint2Y: number,
  endX: number,
  endY: number,
];
export type TParsedRelativeCubicCurveCommand = [
  command: 'c',
  controlPoint1DX: number,
  controlPoint1DY: number,
  controlPoint2DX: number,
  controlPoint2DY: number,
  endDX: number,
  endDY: number,
];
export type TParsedCubicCurveCommand =
  | TParsedAbsoluteCubicCurveCommand
  | TParsedRelativeCubicCurveCommand;

export type TCubicCurveCommand = TCommand7<TParsedCubicCurveCommand>;

export type TParsedAbsoluteCubicCurveShortcutCommand = [
  command: 'S',
  controlPoint2X: number,
  controlPoint2Y: number,
  endX: number,
  endY: number,
];
export type TParsedRelativeCubicCurveShortcutCommand = [
  command: 's',
  controlPoint2DX: number,
  controlPoint2DY: number,
  endDX: number,
  endDY: number,
];
export type TParsedCubicCurveShortcutCommand =
  | TParsedAbsoluteCubicCurveShortcutCommand
  | TParsedRelativeCubicCurveShortcutCommand;

export type TCubicCurveShortcutCommand =
  TCommand5<TParsedCubicCurveShortcutCommand>;

export type TParsedAbsoluteQuadraticCurveCommand = [
  command: 'Q',
  controlPointX: number,
  controlPointY: number,
  endX: number,
  endY: number,
];
export type TParsedRelativeQuadraticCurveCommand = [
  command: 'q',
  controlPointDX: number,
  controlPointDY: number,
  endDX: number,
  endDY: number,
];
export type TParsedQuadraticCurveCommand =
  | TParsedAbsoluteQuadraticCurveCommand
  | TParsedRelativeQuadraticCurveCommand;

export type TQuadraticCurveCommand = TCommand5<TParsedQuadraticCurveCommand>;

export type TParsedAbsoluteQuadraticCurveShortcutCommand = [
  command: 'T',
  endX: number,
  endY: number,
];
export type TParsedRelativeQuadraticCurveShortcutCommand = [
  command: 't',
  endDX: number,
  endDY: number,
];
export type TParsedQuadraticCurveShortcutCommand =
  | TParsedAbsoluteQuadraticCurveShortcutCommand
  | TParsedRelativeQuadraticCurveShortcutCommand;

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
  endY: number,
];
export type TParsedRelativeArcCommand = [
  command: 'a',
  radiusX: number,
  radiusY: number,
  rotation: TRadian,
  largeArc: 0 | 1,
  sweep: 0 | 1,
  endDX: number,
  endDY: number,
];

export type TParsedArcCommand =
  | TParsedAbsoluteArcCommand
  | TParsedRelativeArcCommand;

export type TArcCommandSingleFlag<T extends TParsedArcCommand> =
  `${T[0]} ${T[1]} ${T[2]} ${T[3]} ${T[4]}${T[5]} ${T[6]} ${T[7]}`;
export type TArcCommand =
  | TCommand8<TParsedArcCommand>
  | TArcCommandSingleFlag<TParsedArcCommand>;

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
  | TParsedAbsoluteClosePathCommand
  | TParsedAbsoluteCubicCurveCommand
  | TParsedAbsoluteQuadraticCurveCommand;

export type TSimpleParseCommandType = 'L' | 'M' | 'C' | 'Q' | 'Z';

export type TComplexParsedCommandType =
  | 'M'
  | 'L'
  | 'C'
  | 'Q'
  | 'Z'
  | 'z'
  | 'm'
  | 'l'
  | 'h'
  | 'v'
  | 'c'
  | 's'
  | 'q'
  | 't'
  | 'a'
  | 'H'
  | 'V'
  | 'S'
  | 'T'
  | 'A';

/**
 * A series of simple paths
 */
export type TSimplePathData = TSimpleParsedCommand[];

/**
 * A point (vector) and angle between the vector and x-axis
 */
export type TPointAngle = XY & { angle: TRadian };

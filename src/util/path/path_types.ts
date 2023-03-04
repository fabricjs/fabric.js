import { TRadian } from '../../typedefs';
import { IPoint, Point } from '../../Point';

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
export const reMoveToCommand = new RegExp(
  String.raw`(M) (?:${p} ${p} ?)+`,
  'gi'
);

export function isAbsMoveToCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteMoveToCommand {
  return cmd.length == 3 && cmd[0] == 'M';
}
export function isRelMoveToCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeMoveToCommand {
  return cmd.length == 3 && cmd[0] == 'm';
}

export type TParsedAbsoluteLineCommand = [command: 'L', x: number, y: number];
export type TParsedRelativeLineCommand = [command: 'l', dx: number, dy: number];
export type TParsedLineCommand =
  | TParsedAbsoluteLineCommand
  | TParsedRelativeLineCommand;

export type TLineCommand = TCommand3<TParsedLineCommand>;
export const reLineCommand = new RegExp(String.raw`(L) (?:${p} ${p} ?)+`, 'gi');

export function isAbsLineCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteLineCommand {
  return cmd.length == 3 && cmd[0] == 'L';
}
export function isRelLineCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeLineCommand {
  return cmd.length == 3 && cmd[0] == 'l';
}
export function isLineCommand(
  cmd: TComplexParsedCommand
): cmd is TParsedLineCommand {
  return isAbsLineCmd(cmd) || isRelLineCmd(cmd);
}

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

export function isAbsHorizontalLineCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteHorizontalLineCommand {
  return cmd.length == 2 && cmd[0] == 'H';
}
export function isRelHorizontalLineCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeHorizontalLineCommand {
  return cmd.length == 2 && cmd[0] == 'h';
}

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

export function isAbsVerticalLineCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteVerticalLineCommand {
  return cmd.length == 2 && cmd[0] == 'V';
}
export function isRelVerticalLineCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeVerticalLineCommand {
  return cmd.length == 2 && cmd[0] == 'v';
}

export type TParsedAbsoluteClosePathCommand = [command: 'Z'];
export type TParsedRelativeClosePathCommand = [command: 'z'];
export type TParsedClosePathCommand =
  | TParsedAbsoluteClosePathCommand
  | TParsedRelativeClosePathCommand;

export type TClosePathCommand = TCommand1<TParsedClosePathCommand>;
export const reClosePathCommand = new RegExp(String.raw`(Z)\s*`, 'gi');

export function isAbsClosePathCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteClosePathCommand {
  return cmd.length == 1 && cmd[0] == 'Z';
}
export function isRelClosePathCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeClosePathCommand {
  return cmd.length == 1 && cmd[0] == 'z';
}
export function isClosePathCommand(
  cmd: TComplexParsedCommand
): cmd is TParsedClosePathCommand {
  return cmd.length == 1 && (cmd[0] == 'z' || cmd[0] == 'Z');
}

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

export function isAbsCubicCurveCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteCubicCurveCommand {
  return cmd.length == 7 && cmd[0] == 'C';
}
export function isRelCubicCurveCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeCubicCurveCommand {
  return cmd.length == 7 && cmd[0] == 'c';
}

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

export function isAbsCubicCurveShortcutCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteCubicCurveShortcutCommand {
  return cmd.length == 5 && cmd[0] == 'S';
}
export function isRelCubicCurveShortcutCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeCubicCurveShortcutCommand {
  return cmd.length == 5 && cmd[0] == 's';
}

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

export function isAbsQuadraticCurveCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteQuadraticCurveCommand {
  return cmd.length == 5 && cmd[0] == 'Q';
}
export function isRelQuadraticCurveCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeQuadraticCurveCommand {
  return cmd.length == 5 && cmd[0] == 'q';
}

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

export type TQuadraticCurveShortcutCommand =
  TCommand3<TParsedQuadraticCurveShortcutCommand>;
export const reQuadraticCurveShortcutCommand = new RegExp(
  String.raw`(T) (?:${p} ${p} ?)+`,
  'gi'
);

export function isAbsQuadraticCurveShortcutCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteQuadraticCurveShortcutCommand {
  return cmd.length == 3 && cmd[0] == 'T';
}
export function isRelQuadraticCurveShortcutCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeQuadraticCurveShortcutCommand {
  return cmd.length == 3 && cmd[0] == 't';
}

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
export function isAbsArcCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedAbsoluteArcCommand {
  return cmd.length == 8 && cmd[0] == 'A';
}
export function isRelArcCmd(
  cmd: TComplexParsedCommand
): cmd is TParsedRelativeArcCommand {
  return cmd.length == 8 && cmd[0] == 'a';
}

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

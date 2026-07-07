import type {
  TComplexParsedCommand,
  TParsedAbsoluteArcCommand,
  TParsedAbsoluteClosePathCommand,
  TParsedAbsoluteCubicCurveCommand,
  TParsedAbsoluteCubicCurveShortcutCommand,
  TParsedAbsoluteHorizontalLineCommand,
  TParsedAbsoluteLineCommand,
  TParsedAbsoluteMoveToCommand,
  TParsedAbsoluteQuadraticCurveCommand,
  TParsedAbsoluteQuadraticCurveShortcutCommand,
  TParsedAbsoluteVerticalLineCommand,
  TParsedClosePathCommand,
  TParsedLineCommand,
  TParsedRelativeArcCommand,
  TParsedRelativeClosePathCommand,
  TParsedRelativeCubicCurveCommand,
  TParsedRelativeCubicCurveShortcutCommand,
  TParsedRelativeHorizontalLineCommand,
  TParsedRelativeLineCommand,
  TParsedRelativeMoveToCommand,
  TParsedRelativeQuadraticCurveCommand,
  TParsedRelativeQuadraticCurveShortcutCommand,
  TParsedRelativeVerticalLineCommand,
} from './typedefs';

export function isAbsMoveToCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteMoveToCommand {
  return cmd.length == 3 && cmd[0] == 'M';
}
export function isRelMoveToCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeMoveToCommand {
  return cmd.length == 3 && cmd[0] == 'm';
}

export function isAbsLineCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteLineCommand {
  return cmd.length == 3 && cmd[0] == 'L';
}
export function isRelLineCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeLineCommand {
  return cmd.length == 3 && cmd[0] == 'l';
}
export function isLineCommand(
  cmd: TComplexParsedCommand,
): cmd is TParsedLineCommand {
  return isAbsLineCmd(cmd) || isRelLineCmd(cmd);
}

export function isAbsHorizontalLineCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteHorizontalLineCommand {
  return cmd.length == 2 && cmd[0] == 'H';
}
export function isRelHorizontalLineCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeHorizontalLineCommand {
  return cmd.length == 2 && cmd[0] == 'h';
}

export function isAbsVerticalLineCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteVerticalLineCommand {
  return cmd.length == 2 && cmd[0] == 'V';
}
export function isRelVerticalLineCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeVerticalLineCommand {
  return cmd.length == 2 && cmd[0] == 'v';
}

export function isAbsClosePathCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteClosePathCommand {
  return cmd.length == 1 && cmd[0] == 'Z';
}
export function isRelClosePathCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeClosePathCommand {
  return cmd.length == 1 && cmd[0] == 'z';
}
export function isClosePathCommand(
  cmd: TComplexParsedCommand,
): cmd is TParsedClosePathCommand {
  return cmd.length == 1 && (cmd[0] == 'z' || cmd[0] == 'Z');
}

export function isAbsCubicCurveCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteCubicCurveCommand {
  return cmd.length == 7 && cmd[0] == 'C';
}
export function isRelCubicCurveCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeCubicCurveCommand {
  return cmd.length == 7 && cmd[0] == 'c';
}

export function isAbsCubicCurveShortcutCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteCubicCurveShortcutCommand {
  return cmd.length == 5 && cmd[0] == 'S';
}
export function isRelCubicCurveShortcutCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeCubicCurveShortcutCommand {
  return cmd.length == 5 && cmd[0] == 's';
}

export function isAbsQuadraticCurveCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteQuadraticCurveCommand {
  return cmd.length == 5 && cmd[0] == 'Q';
}
export function isRelQuadraticCurveCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeQuadraticCurveCommand {
  return cmd.length == 5 && cmd[0] == 'q';
}

export function isAbsQuadraticCurveShortcutCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteQuadraticCurveShortcutCommand {
  return cmd.length == 3 && cmd[0] == 'T';
}
export function isRelQuadraticCurveShortcutCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeQuadraticCurveShortcutCommand {
  return cmd.length == 3 && cmd[0] == 't';
}

export function isAbsArcCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedAbsoluteArcCommand {
  return cmd.length == 8 && cmd[0] == 'A';
}
export function isRelArcCmd(
  cmd: TComplexParsedCommand,
): cmd is TParsedRelativeArcCommand {
  return cmd.length == 8 && cmd[0] == 'a';
}

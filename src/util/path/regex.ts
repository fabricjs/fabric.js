// absolute value number
const absNumberRegExStr = String.raw`(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?`;
export const numberRegExStr = `[-+]?${absNumberRegExStr}`;

/**
 * p for param
 * using "bad naming" here because it makes the regex much easier to read
 */
const p = `(${numberRegExStr})`;

export const reMoveToCommand = `(M) (?:${p} ${p} ?)+`;

export const reLineCommand = `(L) (?:${p} ${p} ?)+`;

export const reHorizontalLineCommand = `(H) (?:${p} ?)+`;

export const reVerticalLineCommand = `(V) (?:${p} ?)+`;

export const reClosePathCommand = String.raw`(Z)\s*`;

export const reCubicCurveCommand = `(C) (?:${p} ${p} ${p} ${p} ${p} ${p} ?)+`;

export const reCubicCurveShortcutCommand = `(S) (?:${p} ${p} ${p} ${p} ?)+`;

export const reQuadraticCurveCommand = `(Q) (?:${p} ${p} ${p} ${p} ?)+`;

export const reQuadraticCurveShortcutCommand = `(T) (?:${p} ${p} ?)+`;

export const reArcCommand = `(A) (?:${p} ${p} ${p} ([01]) ?([01]) ${p} ${p} ?)+`;

export const rePathCommand =
  `(?:(?:${reMoveToCommand})` +
  `|(?:${reLineCommand})` +
  `|(?:${reHorizontalLineCommand})` +
  `|(?:${reVerticalLineCommand})` +
  `|(?:${reClosePathCommand})` +
  `|(?:${reCubicCurveCommand})` +
  `|(?:${reCubicCurveShortcutCommand})` +
  `|(?:${reQuadraticCurveCommand})` +
  `|(?:${reQuadraticCurveShortcutCommand})` +
  `|(?:${reArcCommand}))`;

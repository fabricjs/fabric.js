// absolute value number
const absNumberRegExStr = String.raw`(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?`;
export const numberRegExStr = `[-+]?${absNumberRegExStr}`;

/**
 * p for param
 * using "bad naming" here because it makes the regex much easier to read
 */
const p = `(${numberRegExStr})`;

const reMoveToCommand = `(M) (?:${p} ${p} ?)+`;

const reLineCommand = `(L) (?:${p} ${p} ?)+`;

const reHorizontalLineCommand = `(H) (?:${p} ?)+`;

const reVerticalLineCommand = `(V) (?:${p} ?)+`;

const reClosePathCommand = String.raw`(Z)\s*`;

const reCubicCurveCommand = `(C) (?:${p} ${p} ${p} ${p} ${p} ${p} ?)+`;

const reCubicCurveShortcutCommand = `(S) (?:${p} ${p} ${p} ${p} ?)+`;

const reQuadraticCurveCommand = `(Q) (?:${p} ${p} ${p} ${p} ?)+`;

const reQuadraticCurveShortcutCommand = `(T) (?:${p} ${p} ?)+`;

const reArcCommand = `(A) (?:${p} ${p} ${p} ([01]) ?([01]) ${p} ${p} ?)+`;

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

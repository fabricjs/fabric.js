// absolute value number
const absNumberRegExStr = String.raw`(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?`;
export const numberRegExStr = String.raw`[-+]?${absNumberRegExStr}`;

/**
 * p for param
 * using "bad naming" here because it makes the regex much easier to read
 */
const p = `(${numberRegExStr})`;

export const reMoveToCommand = new RegExp(
  String.raw`(M) (?:${p} ${p} ?)+`,
  'gi'
);

export const reLineCommand = new RegExp(String.raw`(L) (?:${p} ${p} ?)+`, 'gi');

export const reHorizontalLineCommand = new RegExp(
  String.raw`(H) (?:${p} ?)+`,
  'gi'
);

export const reVerticalLineCommand = new RegExp(
  String.raw`(V) (?:${p} ?)+`,
  'gi'
);

export const reClosePathCommand = new RegExp(String.raw`(Z)\s*`, 'gi');

export const reCubicCurveCommand = new RegExp(
  String.raw`(C) (?:${p} ${p} ${p} ${p} ${p} ${p} ?)+`,
  'gi'
);

export const reCubicCurveShortcutCommand = new RegExp(
  String.raw`(S) (?:${p} ${p} ${p} ${p} ?)+`,
  'gi'
);

export const reQuadraticCurveCommand = new RegExp(
  String.raw`(Q) (?:${p} ${p} ${p} ${p} ?)+`,
  'gi'
);

export const reQuadraticCurveShortcutCommand = new RegExp(
  String.raw`(T) (?:${p} ${p} ?)+`,
  'gi'
);

export const reArcCommand = new RegExp(
  String.raw`(A) (?:${p} ${p} ${p} ([01]) ?([01]) ${p} ${p} ?)+`,
  'gi'
);

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
  'gi'
);

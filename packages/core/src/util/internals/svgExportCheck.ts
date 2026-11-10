const unsafeSvgStyleValueRegex = new RegExp(
  String.raw`[\0-\x1F\x7F;<>\\]|\/\*|\*\/|url\s*\(|expression\s*\(|(?:java|vb)script\s*:|data\s*:|@import\b`,
  'iu',
);

export const isSafeSvgStyleValue = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  !unsafeSvgStyleValueRegex.test(value);

export const getSafeSvgStyleNumber = (
  value: unknown,
  fallback = '',
): string => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? `${numeric}` : fallback;
};

export const getSafeSvgStyleToken = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && isSafeSvgStyleValue(value) ? value : fallback;

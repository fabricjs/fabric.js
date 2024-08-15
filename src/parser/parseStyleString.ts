/**
 * Takes a style string and parses it in one that has only defined values
 * and lowercases properties
 * @param style
 * @param oStyle
 */
export function parseStyleString(
  style: string,
  oStyle: Record<string, any>,
): void {
  style
    .replace(/;\s*$/, '')
    .split(';')
    .forEach((chunk) => {
      if (!chunk) return;
      const [attr, value] = chunk.split(':');
      oStyle[attr.trim().toLowerCase()] = value.trim();
    });
}

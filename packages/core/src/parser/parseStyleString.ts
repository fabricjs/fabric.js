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
      const [attr, value] = chunk.split(':');
      // skip empty or blank declarations, e.g. `fill:red; ;` or `style=" "`
      if (value === undefined) return;
      oStyle[attr.trim().toLowerCase()] = value.trim();
    });
}

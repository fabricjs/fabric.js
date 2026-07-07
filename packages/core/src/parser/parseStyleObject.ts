/**
 * Takes a style object and parses it in one that has only defined values
 * and lowercases properties
 * @param style
 * @param oStyle
 */
export function parseStyleObject(
  style: Record<string, any>,
  oStyle: Record<string, any>,
): void {
  Object.entries(style).forEach(([prop, value]) => {
    if (value === undefined) {
      return;
    }
    oStyle[prop.toLowerCase()] = value;
  });
}

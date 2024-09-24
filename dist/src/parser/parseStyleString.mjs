/**
 * Takes a style string and parses it in one that has only defined values
 * and lowercases properties
 * @param style
 * @param oStyle
 */
function parseStyleString(style, oStyle) {
  style.replace(/;\s*$/, '').split(';').forEach(chunk => {
    if (!chunk) return;
    const [attr, value] = chunk.split(':');
    oStyle[attr.trim().toLowerCase()] = value.trim();
  });
}

export { parseStyleString };
//# sourceMappingURL=parseStyleString.mjs.map

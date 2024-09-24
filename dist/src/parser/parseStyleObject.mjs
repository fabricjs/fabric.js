/**
 * Takes a style object and parses it in one that has only defined values
 * and lowercases properties
 * @param style
 * @param oStyle
 */
function parseStyleObject(style, oStyle) {
  Object.entries(style).forEach(_ref => {
    let [prop, value] = _ref;
    if (value === undefined) {
      return;
    }
    oStyle[prop.toLowerCase()] = value;
  });
}

export { parseStyleObject };
//# sourceMappingURL=parseStyleObject.mjs.map

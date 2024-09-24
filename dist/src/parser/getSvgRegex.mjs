function getSvgRegex(arr) {
  return new RegExp('^(' + arr.join('|') + ')\\b', 'i');
}

export { getSvgRegex };
//# sourceMappingURL=getSvgRegex.mjs.map

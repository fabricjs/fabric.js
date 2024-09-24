/**
 * Parses "points" attribute, returning an array of values
 * @static
 * @memberOf fabric
 * @param {String} points points attribute string
 * @return {Array} array of points
 */
function parsePointsAttribute(points) {
  // points attribute is required and must not be empty
  if (!points) {
    return [];
  }

  // replace commas with whitespace and remove bookending whitespace
  const pointsSplit = points.replace(/,/g, ' ').trim().split(/\s+/);
  const parsedPoints = [];
  for (let i = 0; i < pointsSplit.length; i += 2) {
    parsedPoints.push({
      x: parseFloat(pointsSplit[i]),
      y: parseFloat(pointsSplit[i + 1])
    });
  }

  // odd number of points is an error
  // if (parsedPoints.length % 2 !== 0) {
  //   return null;
  // }
  return parsedPoints;
}

export { parsePointsAttribute };
//# sourceMappingURL=parsePointsAttribute.mjs.map

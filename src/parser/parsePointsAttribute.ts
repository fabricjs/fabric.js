//@ts-nocheck

/**
 * Parses "points" attribute, returning an array of values
 * @static
 * @memberOf fabric
 * @param {String} points points attribute string
 * @return {Array} array of points
 */
export function parsePointsAttribute(points) {
  // points attribute is required and must not be empty
  if (!points) {
    return null;
  }

  // replace commas with whitespace and remove bookending whitespace
  points = points.replace(/,/g, ' ').trim();

  points = points.split(/\s+/);
  const parsedPoints = [];

  for (let i = 0; i < points.length; i += 2) {
    parsedPoints.push({
      x: parseFloat(points[i]),
      y: parseFloat(points[i + 1]),
    });
  }

  // odd number of points is an error
  // if (parsedPoints.length % 2 !== 0) {
  //   return null;
  // }
  return parsedPoints;
}

import { Point } from "../point";
import { Object } from "../shapes/object"

interface ObjectGeometry {
  /**
   * Describe object's corner position in canvas element coordinates.
   * properties are tl,mt,tr,ml,mr,bl,mb,br,mtr for the main controls.
   * each property is an object with x, y and corner.
   * The `corner` property contains in a similar manner the 4 points of the
   * interactive area of the corner.
   * The coordinates depends from this properties: width, height, scaleX, scaleY
   * skewX, skewY, angle, strokeWidth, viewportTransform, top, left, padding.
   * The coordinates get updated with @method setCoords.
   * You can calculate them without updating with @method calcCoords;
   * @memberOf fabric.Object.prototype
   */
  oCoords: null,

  /**
   * Describe object's corner position in canvas object absolute coordinates
   * properties are tl,tr,bl,br and describe the four main corner.
   * each property is an object with x, y, instance of Fabric.Point.
   * The coordinates depends from this properties: width, height, scaleX, scaleY
   * skewX, skewY, angle, strokeWidth, top, left.
   * Those coordinates are usefull to understand where an object is. They get updated
   * with oCoords but they do not need to be updated when zoom or panning change.
   * The coordinates get updated with @method setCoords.
   * You can calculate them without updating with @method calcCoords(true);
   * @memberOf fabric.Object.prototype
   */
  aCoords: null,

  /**
   * storage for object transform matrix
   */
  ownMatrixCache: null,

  /**
   * storage for object full transform matrix
   */
  matrixCache: null,

  /**
   * return correct set of coordinates for intersection
   */
  getCoords(absolute: boolean, calculate: boolean): [Point, Point, Point, Point];

  /**
   * Checks if object intersects with an area formed by 2 points
   * @param {Object} pointTL top-left point of area
   * @param {Object} pointBR bottom-right point of area
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object intersects with an area formed by 2 points
   */
  intersectsWithRect(pointTL: Point, pointBR: Point, absolute?: boolean, calculate?: boolean): boolean;

  /**
   * Checks if object intersects with another object
   * @param {Object} other Object to test
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object intersects with another object
   */
  intersectsWithObject(other: Object, absolute?: boolean, calculate?: boolean): boolean

  /**
   * Checks if object is fully contained within area of another object
   * @param {Object} other Object to test
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object is fully contained within area of another object
   */
  isContainedWithinObject(other: Object, absolute?: boolean, calculate?: boolean): boolean;

  /**
   * Checks if object is fully contained within area formed by 2 points
   * @param {Object} pointTL top-left point of area
   * @param {Object} pointBR bottom-right point of area
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object is fully contained within area formed by 2 points
   */
  isContainedWithinRect(pointTL: Point, pointBR: Point, absolute?: boolean, calculate?: boolean): boolean;

  /**
   * Checks if point is inside the object
   * @param {fabric.Point} point Point to check against
   * @param {Object} [lines] object returned from @method _getImageLines
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if point is inside the object
   */
  containsPoint(point: Point, lines?: Object, absolute?: boolean, calculate?: boolean): boolean;

  /**
   * Checks if object is contained within the canvas with current viewportTransform
   * the check is done stopping at first point that appear on screen
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object is fully contained within canvas
   */
  isOnScreen(calculate: boolean): boolean;

  /**
   * Method that returns an object with the object edges in it, given the coordinates of the corners
   * @private
   * @param {Object} oCoords Coordinates of the object corners
   */
  _getImageLines(oCoords: Object): {
      topline: {
        o: Point,
        d: Point
      },
      rightline: {
        o: Point,
        d: Point
      },
      bottomline: {
        o: Point,
        d: Point
      },
      leftline: {
        o: Point,
        d: Point
      }
    };

  /**
   * Returns coordinates of object's bounding rectangle (left, top, width, height)
   * the box is intented as aligned to axis of canvas.
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords / .aCoords
   * @return {Object} Object with left, top, width, height properties
   */
  getBoundingRect(absolute?: boolean, calculate?: boolean): Object;

  /**
   * Returns width of an object bounding box counting transformations
   * @return {Number} width value
   */
  getScaledWidth(): number;

  /**
   * Returns height of an object bounding box counting transformations
   * @return {Number} height value
   */
  getScaledHeight(): number;

  /**
   * Scales an object (equally by x and y)
   * @param {Number} value Scale factor
   * @return {fabric.Object} thisArg
   * @chainable
   */
  scale(value: number): this;

  /**
   * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New width value
   * @param {Boolean} absolute ignore viewport
   * @return {fabric.Object} thisArg
   * @chainable
   */
  scaleToWidth(value: number, absolute: boolean): this;

  /**
   * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New height value
   * @param {Boolean} absolute ignore viewport
   * @return {fabric.Object} thisArg
   * @chainable
   */
  scaleToHeight(value: number, absolute: boolean): this;

  /**
   * Calculate and returns the .coords of an object.
   * @return {Object} Object with tl, tr, br, bl ....
   * @chainable
   */
  calcCoords(absolute: boolean): this;

  /**
   * Sets corner position coordinates based on current angle, width and height
   * See https://github.com/kangax/fabric.js/wiki/When-to-call-setCoords
   * @param {Boolean} [ignoreZoom] set oCoords with or without the viewport transform.
   * @param {Boolean} [skipAbsolute] skip calculation of aCoords, usefull in setViewportTransform
   * @return {fabric.Object} thisArg
   * @chainable
   */
  setCoords(ignoreZoom?: boolean, skipAbsolute?: boolean): this;
}

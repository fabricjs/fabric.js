export class Polygon extends fabric.Polyline {
  /**
   * @todo make this method protected when migrating
   */
  isOpen() {
    return false;
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by `Polygon.fromElement`)
   * @static
   * @memberOf Polygon
   * @see: http://www.w3.org/TR/SVG/shapes.html#PolygonElement
   */
  static ATTRIBUTE_NAMES = SHARED_ATTRIBUTES.concat();

  /**
   * Returns {@link Polygon} instance from an SVG element
   * @static
   * @memberOf Polygon
   * @param {SVGElement} element Element to parse
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  static fromElement = fabric.Polyline.fromElementGenerator('Polygon');

  /**
   * Returns Polygon instance from an object representation
   * @static
   * @memberOf Polygon
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Polygon>}
   */
  static fromObject(object) {
    return FabricObject._fromObject(Polygon, object, {
      extraParam: 'points',
    });
  }
}

export const polygonDefaultValues: Partial<TClassProperties<Polygon>> = {
  type: 'polygon',
};

Object.assign(Polygon.prototype, polygonDefaultValues);
/** @todo TODO_JS_MIGRATION remove next line after refactoring build */
fabric.Polygon = Polygon;

/* _FROM_SVG_START_ */

/* _FROM_SVG_END_ */

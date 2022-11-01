import { fabric } from '../../HEADER';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { TClassProperties } from '../typedefs';
import { FabricObject } from './object.class';
import { Polyline } from './polyline.class';

export class Polygon extends Polyline {
  protected isOpen() {
    return false;
  }

  /* _FROM_SVG_START_ */

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
  static fromElement = Polyline.fromElementGenerator(Polygon);

  /* _FROM_SVG_END_ */

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

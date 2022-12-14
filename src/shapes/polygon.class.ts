import { fabric } from '../../HEADER';
import { TClassProperties } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
import {
  polyFromElement,
  Polyline,
  polylineDefaultValues,
} from './polyline.class';

export class Polygon extends Polyline {
  protected isOpen() {
    return false;
  }

  /* _FROM_SVG_START_ */

  /**
   * Returns {@link Polygon} instance from an SVG element
   * @static
   * @memberOf Polygon
   * @param {SVGElement} element Element to parse
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  static fromElement(
    element: SVGElement,
    callback: (poly: Polygon | null) => any,
    options?: any
  ) {
    return polyFromElement(Polygon, element, callback, options);
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Polygon instance from an object representation
   * @static
   * @memberOf Polygon
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Polygon>}
   */
  static fromObject(object: Record<string, unknown>): Promise<Polygon> {
    return FabricObject._fromObject(Polygon, object, {
      extraParam: 'points',
    });
  }
}

export const polygonDefaultValues: Partial<TClassProperties<Polygon>> = {
  ...polylineDefaultValues,
  type: 'polygon',
};

Object.assign(Polygon.prototype, polygonDefaultValues);
/** @todo TODO_JS_MIGRATION remove next line after refactoring build */
fabric.Polygon = Polygon;

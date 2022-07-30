//@ts-nocheck

import { SHARED_ATTRIBUTES } from '../constants';
import { projectStrokeOnPoints } from '../util';
import { FabricObject } from './object.class';
import { Polyline, fromElementGenerator } from './polyline.class';

/**
 * Polygon class
 * @class Polygon
 * @extends Polyline
 */
export class Polygon extends Polyline {

  /**
   * Type of an object
   * @type String
   * @default
   */
  type = 'polygon'

  /**
   * @private
   */
  _projectStrokeOnPoints() {
    return projectStrokeOnPoints(this.points, this);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    if (!this.commonRender(ctx)) {
      return;
    }
    ctx.closePath();
    this._renderPaintInOrder(ctx);
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
  static fromElement = fromElementGenerator(Polygon);
  /* _FROM_SVG_END_ */

  /**
   * Returns Polygon instance from an object representation
   * @static
   * @memberOf Polygon
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Polygon>}
   */
  static fromObject(object) {
    return FabricObject._fromObject(Polygon, object, { extraParam: 'points' });
  };


}


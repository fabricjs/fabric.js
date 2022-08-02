//@ts-nocheck

import { FabricObject } from "./object.class";

/**
 * Triangle class
 * @class Triangle
 * @extends FabricObject
 */
export class Triangle extends FabricObject {

  /**
   * Type of an object
   * @type String
   * @default
   */
  type = 'triangle'

  /**
   * Width is set to 100 to compensate the old initialize code that was setting it to 100
   * @type Number
   * @default
   */
  width = 100

  /**
   * Height is set to 100 to compensate the old initialize code that was setting it to 100
   * @type Number
   * @default
   */
  height = 100

  constructor(options) {
    this.set(options);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    var widthBy2 = this.width / 2,
      heightBy2 = this.height / 2;

    ctx.beginPath();
    ctx.moveTo(-widthBy2, heightBy2);
    ctx.lineTo(0, -heightBy2);
    ctx.lineTo(widthBy2, heightBy2);
    ctx.closePath();

    this._renderPaintInOrder(ctx);
  }

  /* _TO_SVG_START_ */
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    var widthBy2 = this.width / 2,
      heightBy2 = this.height / 2,
      points = [
        -widthBy2 + ' ' + heightBy2,
        '0 ' + -heightBy2,
        widthBy2 + ' ' + heightBy2
      ].join(',');
    return [
      '<polygon ', 'COMMON_PARTS',
      'points="', points,
      '" />'
    ];
  }
  /* _TO_SVG_END_ */

  /**
   * Returns {@link Triangle} instance from an object representation
   * @static
   * @memberOf Triangle
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Triangle>}
   */
  fromObject(object) {
    return FabricObject._fromObject(Triangle, object);
  }
}




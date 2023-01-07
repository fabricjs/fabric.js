import { TClassProperties } from '../typedefs';
import { classRegistry } from '../util/class_registry';
import { FabricObject } from './Object/FabricObject';

export const triangleDefaultValues: Partial<TClassProperties<Triangle>> = {
  type: 'triangle',
  width: 100,
  height: 100,
};

export class Triangle extends FabricObject {

  constructor(options: any = {}) {
    super({ ...triangleDefaultValues, ...options });
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
    const widthBy2 = this.width / 2,
      heightBy2 = this.height / 2;

    ctx.beginPath();
    ctx.moveTo(-widthBy2, heightBy2);
    ctx.lineTo(0, -heightBy2);
    ctx.lineTo(widthBy2, heightBy2);
    ctx.closePath();

    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const widthBy2 = this.width / 2,
      heightBy2 = this.height / 2,
      points = `${-widthBy2} ${heightBy2},0 ${-heightBy2},${widthBy2} ${heightBy2}`;
    return ['<polygon ', 'COMMON_PARTS', 'points="', points, '" />'];
  }
}

classRegistry.setClass(Triangle);
classRegistry.setSVGClass(Triangle);

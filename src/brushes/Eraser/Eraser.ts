import { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { TClassProperties } from '../../typedefs';
import {
  enlivenObjectEnlivables,
  enlivenObjects,
} from '../../util/misc/objectEnlive';

/**
 * An object's Eraser
 */
export class Eraser extends Group {
  drawObject(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
    super.drawObject(ctx);
  }

  /**
   * Returns svg representation of an instance
   * use <mask> to achieve erasing for svg, credit: https://travishorn.com/removing-parts-of-shapes-in-svg-b539a89e5649
   * for masking we need to add a white rect before all paths
   *
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  _toSVG(reviver?: (markup: string) => string) {
    const svgString = ['<g ', 'COMMON_PARTS', ' >\n'];
    const x = -this.width / 2,
      y = -this.height / 2;
    const rectSvg = `<rect fill="white" x="${x}" y="${y}" width="${this.width}" height="${this.height}" />\n`;
    svgString.push('\t\t', rectSvg);
    for (let i = 0, len = this._objects.length; i < len; i++) {
      svgString.push('\t\t', this._objects[i].toSVG(reviver));
    }
    svgString.push('</g>\n');
    return svgString;
  }

  static fromObject({ objects = [], ...options }) {
    return Promise.all([
      enlivenObjects(objects),
      enlivenObjectEnlivables(options),
    ]).then(
      ([objects, hydratedOptions]) =>
        new Eraser(objects, { ...options, ...hydratedOptions }, true)
    );
  }
}

export const eraserDefaultValues: Partial<TClassProperties<Eraser>> = {
  type: 'eraser',
  originX: 'center',
  originY: 'center',
  /**
   * eraser should retain size
   * dimensions should not change when paths are added or removed
   * handled by {@link FabricObject#_drawClipPath}
   */
  layout: 'fixed',
};

Object.assign(Eraser.prototype, eraserDefaultValues);

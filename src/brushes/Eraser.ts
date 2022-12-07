import type { FabricObject } from '../shapes/fabricObject.class';
import { Group } from '../shapes/group.class';
import { Path } from '../shapes/path.class';
import { TClassProperties } from '../typedefs';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import {
  enlivenObjectEnlivables,
  enlivenObjects,
} from '../util/misc/objectEnlive';
import { applyTransformToObject } from '../util/misc/objectTransforms';
import { EraserBrush, ErasingEventContextData } from './EraserBrush';

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
   * Clones an object's eraser paths into the canvas plane
   * @param object the owner of the eraser that you want to clone
   * @param [applyClipPath] controls whether the cloned eraser's paths should be clipped by the object's clip path
   * @returns
   */
  static cloneFromObject(
    object: FabricObject & Required<Pick<FabricObject, 'eraser'>>,
    applyClipPath = true
  ) {
    const { clipPath, eraser } = object;
    const transform = object.calcTransformMatrix();
    return Promise.all([
      eraser.clone(),
      applyClipPath && clipPath?.clone(['absolutePositioned', 'inverted']),
    ]).then(([eraser, clipPath]) => {
      return Promise.all(
        (
          eraser._objects.filter((object) => object instanceof Path) as Path[]
        ).map((path) => {
          //  first we transform the path from the group's coordinate system to the canvas'
          const originalTransform = multiplyTransformMatrices(
            transform,
            path.calcTransformMatrix()
          );
          applyTransformToObject(path, originalTransform);
          return clipPath
            ? EraserBrush.applyClipPathToPath(path, clipPath, transform)
            : path;
        })
      );
    });
  }

  /**
   * Propagates eraser from group to its descendants,
   * use when switching the `erasable` property from `true` to `deep` and/or when removing objects from group
   * @param group
   * @returns
   */
  static propagateToGroupDescendants<T extends Group>(group: T) {
    if (group.eraser) {
      return Eraser.cloneFromObject(
        group as FabricObject & Required<Pick<FabricObject, 'eraser'>>
      )
        .then((paths) =>
          paths.map((path) => {
            const context: ErasingEventContextData & { path: Path } = {
              targets: [],
              subTargets: [],
              paths: new Map(),
              path,
            };
            group.forEachObject((object) =>
              EraserBrush.addPathToObjectEraser(object, path, context)
            );
            return context;
          })
        )
        .then((context) => {
          group.set('eraser', undefined);
          return context;
        });
    }
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

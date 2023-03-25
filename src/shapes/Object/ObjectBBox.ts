import { Canvas } from '../../canvas/Canvas';
import { StaticCanvas } from '../../canvas/StaticCanvas';
import { iMatrix } from '../../constants';
import { ObjectEvents } from '../../EventTypeDefs';
import { Point } from '../../Point';
import type { TDegree, TMat2D, TRadian } from '../../typedefs';
import { mapValues } from '../../util/internals';
import {
  composeMatrix,
  multiplyTransformMatrices,
} from '../../util/misc/matrix';
import {
  calcVectorRotation,
  getUnitVector,
  rotateVector,
} from '../../util/misc/vectors';
import { BBox } from '../../BBox/BBox';
import { ObjectLayout } from './ObjectLayout';
import { ControlProps } from './types/ControlProps';
import { FillStrokeProps } from './types/FillStrokeProps';

export class ObjectBBox<EventSpec extends ObjectEvents = ObjectEvents>
  extends ObjectLayout<EventSpec>
  implements
    Pick<FillStrokeProps, 'strokeWidth' | 'strokeUniform'>,
    Pick<ControlProps, 'padding'>
{
  declare strokeWidth: number;
  declare strokeUniform: boolean;
  declare padding: number;

  private _bbox?: BBox;

  get bbox() {
    if (!this._bbox) {
      this._bbox = BBox.rotated(this);
    }
    return this._bbox;
  }

  /**
   * A Reference of the Canvas where the object is actually added
   * @type StaticCanvas | Canvas;
   * @default undefined
   * @private
   */
  declare canvas?: StaticCanvas | Canvas;

  /**
   * Override this method if needed
   */
  needsViewportCoords() {
    // not working yet
    return true;
    // return (this.strokeUniform && this.strokeWidth > 0) || !!this.padding;
  }

  getCanvasRetinaScaling() {
    return this.canvas?.getRetinaScaling() || 1;
  }

  /**
   * Retrieves viewportTransform from Object's canvas if possible
   * @method getViewportTransform
   * @memberOf FabricObject.prototype
   * @return {TMat2D}
   */
  getViewportTransform(): TMat2D {
    return this.canvas?.viewportTransform || (iMatrix.concat() as TMat2D);
  }

  calcTransformMatrixInViewport() {
    return multiplyTransformMatrices(
      this.getViewportTransform(),
      this.calcTransformMatrix()
    );
  }

  /**
   * Returns the object angle relative to canvas
   * @param {TRadian} [inViewport] defaults to true
   * @returns {TDegree}
   */
  getTotalAngle(inViewport = true): TRadian {
    const center = this.getRelativeCenterPoint();
    const own = composeMatrix({
      angle: this.angle,
      translateX: center.x,
      translateY: center.y,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      // TODO: should we pass 0 here?
      skewY: this.skewY,
      // flipping should not be taken into account in the angle, it is taken into account in the bbox transformation
      flipX: false,
      flipY: false,
    });
    const t = this.group
      ? multiplyTransformMatrices(this.group.calcTransformMatrix(), own)
      : own;
    const [a, b] = inViewport
      ? multiplyTransformMatrices(this.getViewportTransform(), t)
      : t;
    return calcVectorRotation({ x: a, y: b });
  }

  protected calcDimensionsVector(
    origin = new Point(1, 1),
    {
      applyViewportTransform = this.needsViewportCoords(),
      transform = this.calcTransformMatrix(),
    }: {
      applyViewportTransform?: boolean;
      transform?: TMat2D;
    } = {}
  ) {
    const vpt = applyViewportTransform ? this.getViewportTransform() : iMatrix;
    const dimVector = origin
      .multiply(new Point(this.width, this.height))
      .add(origin.scalarMultiply(!this.strokeUniform ? this.strokeWidth : 0))
      .transform(multiplyTransformMatrices(vpt, transform), true);
    const strokeUniformVector = getUnitVector(dimVector).scalarMultiply(
      this.strokeUniform ? this.strokeWidth : 0
    );
    return dimVector.add(strokeUniformVector);
  }

  protected calcCoord(
    origin: Point,
    {
      offset = new Point(),
      applyViewportTransform = this.needsViewportCoords(),
      padding = 0,
    }: {
      offset?: Point;
      applyViewportTransform?: boolean;
      padding?: number;
    } = {}
  ) {
    const vpt = applyViewportTransform ? this.getViewportTransform() : iMatrix;
    const offsetVector = rotateVector(
      offset.add(origin.scalarMultiply(padding * 2)),
      this.getTotalAngle(applyViewportTransform)
    );
    const realCenter = this.getCenterPoint().transform(vpt);
    return realCenter
      .add(this.calcDimensionsVector(origin, { applyViewportTransform }))
      .add(offsetVector);
  }

  /**
   * Calculates the coordinates of the 4 corner of the bbox
   * @return {TCornerPoint}
   */
  calcCoords() {
    // const size = new Point(this.width, this.height);
    // return projectStrokeOnPoints(
    //   [
    //     new Point(-0.5, -0.5),
    //     new Point(0.5, -0.5),
    //     new Point(-0.5, 0.5),
    //     new Point(0.5, 0.5),
    //   ].map((origin) => origin.multiply(size)),
    //   {
    //     ...this,
    //     ...qrDecompose(
    //       multiplyTransformMatrices(
    //         this.needsViewportCoords() ? this.getViewportTransform() : iMatrix,
    //         this.calcTransformMatrix()
    //       )
    //     ),
    //   }
    // );

    return mapValues(
      {
        tl: new Point(-0.5, -0.5),
        tr: new Point(0.5, -0.5),
        bl: new Point(-0.5, 0.5),
        br: new Point(0.5, 0.5),
      },
      (origin) => this.calcCoord(origin)
    );
  }

  getCoords(absolute = false) {
    return Object.values(
      (absolute ? this.bbox.sendToCanvas() : this.bbox).getCoords()
    );
  }

  /**
   * Sets corner and controls position coordinates based on current angle, dimensions and position.
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
   */
  setCoords(): void {
    this._bbox = BBox.rotated(this);

    // // debug code
    // setTimeout(() => {
    //   const canvas = this.canvas;
    //   if (!canvas) return;
    //   const ctx = canvas.contextTop;
    //   canvas.clearContext(ctx);
    //   ctx.save();
    //   const draw = (point: Point, color: string, radius = 6) => {
    //     ctx.fillStyle = color;
    //     ctx.beginPath();
    //     ctx.ellipse(point.x, point.y, radius, radius, 0, 0, 360);
    //     ctx.closePath();
    //     ctx.fill();
    //   };
    //   [
    //     new Point(-0.5, -0.5),
    //     new Point(0.5, -0.5),
    //     new Point(-0.5, 0.5),
    //     new Point(0.5, 0.5),
    //   ].forEach((origin) => {
    //     draw(BBox.bbox(this).pointFromOrigin(origin), 'yellow', 10);
    //     draw(BBox.rotated(this).pointFromOrigin(origin), 'orange', 8);
    //     draw(BBox.transformed(this).pointFromOrigin(origin), 'silver', 6);
    //     ctx.save();
    //     ctx.transform(...this.getViewportTransform());
    //     draw(BBox.bbox(this).sendToCanvas().pointFromOrigin(origin), 'red', 10);
    //     draw(
    //       BBox.rotated(this).sendToCanvas().pointFromOrigin(origin),
    //       'magenta',
    //       8
    //     );
    //     draw(
    //       BBox.transformed(this).sendToCanvas().pointFromOrigin(origin),
    //       'blue',
    //       6
    //     );
    //     ctx.restore();
    //   });
    //   ctx.restore();
    // }, 50);
  }
}

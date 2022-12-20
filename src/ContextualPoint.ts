import { iMatrix } from './constants';
import { Point } from './point.class';
import { FabricObject } from './shapes/Object/Object';
import { StaticCanvas } from './static_canvas.class';
import { TMat2D } from './typedefs';
import { invertTransform, multiplyTransformMatrices } from './util/misc/matrix';
import { calcPlaneChangeMatrix } from './util/misc/planeChange';

function extractCanvasOffset(value: StaticCanvas | { offset: Point }) {
  return value instanceof StaticCanvas
    ? new Point(value._offset.left, value._offset.top)
    : new Point(value.offset);
}

export class ContextualPoint extends Point {
  private _plane: TMat2D | FabricObject = iMatrix;
  private _canvas?: StaticCanvas | { viewportTransform: TMat2D; offset: Point };
  getPlaneMatrix(applyViewportTransform = false) {
    const plane =
      this._plane instanceof FabricObject
        ? this._plane.calcTransformMatrix()
        : this._plane;
    return applyViewportTransform && this._canvas
      ? multiplyTransformMatrices(this._canvas.viewportTransform, plane)
      : plane;
  }
  getPlane() {
    return this._plane;
  }
  setPlane(
    plane: TMat2D | FabricObject,
    canvas?: StaticCanvas | { viewportTransform: TMat2D; offset: Point }
  ) {
    this._plane = plane;
    this._canvas = canvas;
  }
  freezePlane() {
    this._plane =
      this._plane instanceof FabricObject
        ? this._plane.calcTransformMatrix()
        : (this._plane.concat() as TMat2D);
  }
  freezeCanvasPlane() {
    this._canvas = this._canvas
      ? {
          viewportTransform: [...this._canvas.viewportTransform],
          offset: extractCanvasOffset(this._canvas),
        }
      : undefined;
  }
  freeze() {
    this.freezePlane();
    this.freezeCanvasPlane();
  }
  sendToPlane(to: TMat2D | FabricObject, isVector = false) {
    const canvas = (to instanceof FabricObject && to.canvas) || this._canvas;
    const point = new ContextualPoint(
      canvas !== this._canvas
        ? this.sendToCanvas(canvas as StaticCanvas, isVector).transform(
            calcPlaneChangeMatrix(
              undefined,
              to instanceof FabricObject ? to.calcTransformMatrix() : to
            ),
            isVector
          )
        : this.transform(
            calcPlaneChangeMatrix(
              this.getPlaneMatrix(),
              to instanceof FabricObject ? to.calcTransformMatrix() : to
            ),
            isVector
          )
    );
    point.setPlane(to, canvas);
    return point;
  }
  sendToDOM(isVector = false) {
    return this.transform(this.getPlaneMatrix(true), isVector).add(
      !isVector && this._canvas
        ? extractCanvasOffset(this._canvas)
        : new Point()
    );
  }
  sendToCanvas(canvas: StaticCanvas, isVector = false) {
    return ContextualPoint.sendToCanvas(
      this.sendToDOM(isVector),
      canvas,
      isVector
    );
  }
  static sendToCanvas(DOMPoint: Point, canvas: StaticCanvas, isVector = false) {
    const point = new ContextualPoint(
      DOMPoint.subtract(extractCanvasOffset(canvas)).transform(
        invertTransform(canvas.viewportTransform),
        isVector
      )
    );
    point._canvas = canvas;
    return point;
  }
}

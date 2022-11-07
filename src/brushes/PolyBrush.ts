import { fabric } from '../../HEADER';
import { Point } from '../point.class';
import { Polygon } from '../shapes/polygon.class';
import { Polyline } from '../shapes/polyline.class';
import { invertTransform } from '../util/misc/matrix';
import { BaseBrush } from './base_brush.class';

export class PolyBrush extends BaseBrush {
  poly: Polyline | undefined;
  builder = Polygon;
  width = 5;
  stroke = '';
  fill = '';

  private normalizePointer(pointer: Point) {
    return pointer.transform(this.canvas.viewportTransform, true);
  }

  addPoint(pointer: Point) {
    this.poly!.points.push(this.normalizePointer(pointer));
  }

  replacePoint(pointer: Point) {
    this.poly!.points.pop();
    this.addPoint(pointer);
    this._render();
  }

  private create(pointer: Point) {
    const p = this.normalizePointer(pointer);
    this.poly = new this.builder([p, p], {
      objectCaching: false,
      canvas: this.canvas,
    });
    this.setStyles();
  }

  setStyles() {
    this.poly?.set({
      stroke: this.stroke || this.color,
      fill: this.fill || this.color,
      strokeWidth: this.width,
      strokeLineCap: this.strokeLineCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeLineJoin: this.strokeLineJoin,
      strokeDashArray: this.strokeDashArray,
    });
  }

  private finalize() {
    // release interaction
    this.canvas._isCurrentlyDrawing = false;
    const poly = this.poly;
    if (!poly) return;
    // restore default value
    poly.set('objectCaching', this.builder.prototype.objectCaching);
    const pos = poly.setDimensions().scalarAdd(this.width / 2);
    poly.setPositionByOrigin(pos, 'left', 'top');
    poly.setCoords();
    this.canvas.add(this.poly);
    this.canvas.fire('path:created', { path: this.poly });
    this.canvas.clearContext(this.canvas.contextTop);
    this.poly = undefined;
  }

  _setBrushStyles() {
    this.setStyles();
  }

  onMouseDown(pointer: Point) {
    if (this.poly) {
      this.addPoint(pointer);
    } else {
      this.create(pointer);
    }
  }

  onMouseMove(pointer: Point) {
    this.replacePoint(pointer);
  }

  onMouseUp({ pointer }: { pointer: Point }) {
    this.replacePoint(pointer);
    this.addPoint(pointer);
    return true;
  }

  onDoubleClick(pointer: Point) {
    this.poly && this.replacePoint(pointer);
    this.finalize();
  }

  _render(ctx = this.canvas.contextTop) {
    this.canvas.clearContext(this.canvas.contextTop);
    this.poly?.render(ctx);
  }
}

fabric.PolyBrush = PolyBrush;

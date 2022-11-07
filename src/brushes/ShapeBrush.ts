import { fabric } from '../../HEADER';
import { Point } from '../point.class';
import { Circle } from '../shapes/circle.class';
import { Ellipse } from '../shapes/ellipse.class';
import { FabricObject } from '../shapes/fabricObject.class';
import { Rect } from '../shapes/rect.class';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { BaseBrush } from './base_brush.class';

export abstract class ShapeBaseBrush<T extends FabricObject> extends BaseBrush {
  shape: T | undefined;
  stroke = '';
  fill = '';

  private start: Point;

  abstract create(): T;

  protected build() {
    this.shape = this.create();
    this.shape.set('canvas', this.canvas);
    this.setStyles();
  }

  setStyles() {
    this.shape?.set({
      stroke: this.stroke || this.color,
      fill: this.fill || this.color,
      strokeWidth: this.width,
      strokeLineCap: this.strokeLineCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeLineJoin: this.strokeLineJoin,
      strokeDashArray: this.strokeDashArray,
    });
  }

  protected setBounds(a: Point, b: Point) {
    const { left, top, width, height } = makeBoundingBoxFromPoints([a, b]);
    this.shape!.set({ width, height });
    this.shape!.setPositionByOrigin(new Point(left, top), 'left', 'top');
  }

  protected finalize() {
    const shape = this.shape;
    if (!shape) return;
    shape.setCoords();
    this.canvas.add(this.shape);
    this.canvas.fire('path:created', { path: this.shape });
    this.canvas.clearContext(this.canvas.contextTop);
    this.shape = undefined;
  }

  _setBrushStyles() {
    this.setStyles();
  }

  onMouseDown(pointer: Point) {
    this.build(pointer);
    this.start = pointer;
  }

  onMouseMove(pointer: Point) {
    this.setBounds(this.start, pointer);
    this._render();
  }

  onMouseUp({ pointer }: { pointer: Point }) {
    this.setBounds(this.start, pointer);
    this.finalize();
  }

  _render(ctx = this.canvas.contextTop) {
    this.canvas.clearContext(this.canvas.contextTop);
    ctx.save();
    const t = this.canvas.viewportTransform;
    const offset = new Point().transform(t);
    ctx.transform(t[0], t[1], t[2], t[3], -offset.x, -offset.y);
    this.shape!.transform(ctx);
    this.shape!._render(ctx);
    ctx.restore();
  }
}

export class ShapeBrush extends ShapeBaseBrush<FabricObject> {
  builder = Rect;
  create() {
    return new this.builder();
  }
}

export class CircleBrush extends ShapeBaseBrush<Circle> {
  create() {
    return new Circle({});
  }
  protected setBounds(a: Point, b: Point): void {
    const { left, top, width, height } = makeBoundingBoxFromPoints([a, b]);
    this.shape!.set({ radius: Math.max(width, height) / 2 });
    this.shape!.setPositionByOrigin(new Point(left, top), 'left', 'top');
  }
}

export class EllipseBrush extends ShapeBaseBrush<Ellipse> {
  create() {
    return new Ellipse({});
  }
  protected setBounds(a: Point, b: Point): void {
    const { left, top, width, height } = makeBoundingBoxFromPoints([a, b]);
    this.shape!.set({ rx: width / 2, ry: height / 2 });
    this.shape!.setPositionByOrigin(new Point(left, top), 'left', 'top');
  }
}

fabric.ShapeBaseBrush = ShapeBaseBrush;
fabric.ShapeBrush = ShapeBrush;
fabric.CircleBrush = CircleBrush;
fabric.EllipseBrush = EllipseBrush;

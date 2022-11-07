import { fabric } from '../../HEADER';
import { Point } from '../point.class';
import { Circle } from '../shapes/circle.class';
import { Ellipse } from '../shapes/ellipse.class';
import { FabricObject } from '../shapes/fabricObject.class';
import { Rect } from '../shapes/rect.class';
import { BaseBrush, TBrushEventData } from './base_brush.class';

export abstract class ShapeBaseBrush<T extends FabricObject> extends BaseBrush {
  shape: T | undefined;
  stroke = '';
  fill = '';
  centered = false;

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

  protected setBounds(a: Point, b: Point, ev: TBrushEventData) {
    const v = b.subtract(a);
    const shape = this.shape!;
    if (this.centered) {
      shape.set({ width: Math.abs(v.x) * 2, height: Math.abs(v.y) * 2 });
      shape.setPositionByOrigin(a, 0.5, 0.5);
    } else {
      shape.set({ width: Math.abs(v.x), height: Math.abs(v.y) });
      //   keep a in place
      shape.setPositionByOrigin(
        a,
        -Math.sign(v.x) * 0.5 + 0.5,
        -Math.sign(v.y) * 0.5 + 0.5
      );
    }
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
    this.build();
    this.start = pointer;
  }

  onMouseMove(pointer: Point, ev: TBrushEventData) {
    this.setBounds(this.start, pointer, ev);
    this._render();
  }

  onMouseUp(ev: TBrushEventData) {
    this.setBounds(this.start, ev.pointer, ev);
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

export class CircleBrush1 extends ShapeBaseBrush<Circle> {
  create() {
    return new Circle();
  }
  protected setBounds(a: Point, b: Point): void {
    const v = b.subtract(a);
    const shape = this.shape!;
    if (this.centered) {
      shape.set({ radius: v.distanceFrom(new Point()) });
      shape.setPositionByOrigin(a, 0.5, 0.5);
    } else {
      shape.set({ radius: Math.max(Math.abs(v.x), Math.abs(v.y)) / 2 });
      //   keep a in place
      shape.setPositionByOrigin(
        a,
        -Math.sign(v.x) * 0.5 + 0.5,
        -Math.sign(v.y) * 0.5 + 0.5
      );
    }
  }
}

export class EllipseBrush extends ShapeBaseBrush<Ellipse> {
  create() {
    return new Ellipse({});
  }
  protected setBounds(a: Point, b: Point, ev: TBrushEventData) {
    super.setBounds(a, b, ev);
    const shape = this.shape!;
    if (ev.e.shiftKey) {
      const r = Math.max(shape.width, shape.height) / 2;
      shape.set({ rx: r, ry: r });
    } else {
      shape.set({ rx: shape.width / 2, ry: shape.height / 2 });
    }
  }
}

fabric.ShapeBaseBrush = ShapeBaseBrush;
fabric.ShapeBrush = ShapeBrush;
fabric.CircleBrush1 = CircleBrush1;
fabric.EllipseBrush = EllipseBrush;

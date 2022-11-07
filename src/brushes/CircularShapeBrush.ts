import { fabric } from '../../HEADER';
import { Point } from '../point.class';
import { Ellipse } from '../shapes/ellipse.class';
import { ModifierKey } from '../typedefs';
import { TBrushEventData } from './base_brush.class';
import { ShapeBaseBrush } from './ShapeBrush';

export class CircularShapeBrush extends ShapeBaseBrush<Ellipse> {
  /**
   * The event modifier key that makes the brush draw a circle.
   */
  modifierKey?: ModifierKey = 'shiftKey';

  drawCircle?: boolean;

  create() {
    return new Ellipse();
  }

  onMouseMove(pointer: Point, ev: TBrushEventData) {
    this.drawCircle = this.modifierKey && ev.e[this.modifierKey];
    super.onMouseMove(pointer, ev);
  }

  protected setBounds(a: Point, b: Point) {
    const v = b.subtract(a);
    const shape = this.shape!;
    const d = new Point(Math.abs(v.x), Math.abs(v.y));
    // set radii
    if (this.drawCircle) {
      const r = this.centered
        ? d.distanceFrom(new Point())
        : Math.max(d.x, d.y) / 2;
      shape.set({ rx: r, ry: r });
    } else {
      const { x: rx, y: ry } = this.centered ? d : d.scalarDivide(2);
      shape.set({ rx, ry });
    }
    // set position
    if (this.centered) {
      shape.setPositionByOrigin(a, 0.5, 0.5);
    } else {
      // keep a in place
      shape.setPositionByOrigin(
        a,
        -Math.sign(v.x) * 0.5 + 0.5,
        -Math.sign(v.y) * 0.5 + 0.5
      );
    }
  }
}

fabric.CircularShapeBrush = CircularShapeBrush;

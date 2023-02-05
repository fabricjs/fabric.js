import { Point } from '../Point';
import { Ellipse } from '../shapes/Ellipse';
import { DrawShape } from './DrawShape';

export class DrawOval extends DrawShape<Ellipse> {
  builder = Ellipse;

  protected setBounds(a: Point, b: Point) {
    const v = b.subtract(a);
    const shape = this.shape!;
    const d = new Point(Math.abs(v.x), Math.abs(v.y));
    // set radii
    if (this.symmetric) {
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

import { TPointerEventInfo } from '../EventTypeDefs';
import { TFabricEvent } from '../FabricEvent';
import { Point } from '../Point';
import { Polygon } from '../shapes/Polygon';
import { Polyline } from '../shapes/Polyline';
import { DrawShapeBase } from './DrawShapeBase';

export class DrawPoly extends DrawShapeBase<Polyline> {
  builder = Polygon;

  protected subscribe() {
    return [...super.subscribe(), this.on('mouse:dblclick', this.end)];
  }

  private addPoint(pointer: Point) {
    this.shape!.points.push(pointer);
  }

  private replacePoint(pointer: Point) {
    this.shape!.points.pop();
    this.addPoint(pointer);
    this.render();
  }

  create() {
    return new this.builder();
  }

  protected finalizeShape() {
    const shape = super.finalizeShape();
    if (shape) {
      shape.setBoundingBox(true);
      const r = this.width / 2;
      shape.set({
        left: shape.left + r,
        top: shape.top + r,
      });
    }
    return shape;
  }

  down(ev: TFabricEvent<TPointerEventInfo>) {
    super.down(ev);
    const { pointer } = ev;
    if (this.shape) {
      this.addPoint(pointer);
    } else {
      this.build();
      this.addPoint(pointer);
      this.addPoint(pointer);
    }
  }

  move(ev: TFabricEvent<TPointerEventInfo>) {
    super.move(ev);
    this.replacePoint(ev.pointer);
  }

  up(ev: TFabricEvent<TPointerEventInfo>) {
    super.up(ev);
    const { pointer } = ev;
    this.replacePoint(pointer);
    this.addPoint(pointer);
    return true;
  }

  end(ev: TFabricEvent<TPointerEventInfo>) {
    ev.preventDefault();
    this.shape && this.replacePoint(ev.pointer);
    this.finalize();
  }
}

import { iMatrix } from '../../constants';
import { Point } from '../../Point';
import { TCornerPoint, TMat2D } from '../../typedefs';
import { mapValues } from '../../util/internals';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import { multiplyTransformMatrices } from '../../util/misc/matrix';
import {
  calcBaseChangeMatrix,
  sendPointToPlane,
} from '../../util/misc/planeChange';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { createVector } from '../../util/misc/vectors';
import type { ObjectGeometry } from './ObjectGeometry';

export class BBox {
  protected coords: TCornerPoint;
  readonly transform: TMat2D;
  protected vpt: TMat2D;

  constructor(coords: TCornerPoint, transform: TMat2D, vpt: TMat2D) {
    this.coords = coords;
    // @ts-expect-error mutable frozen type
    this.transform = Object.freeze(transform);
    this.vpt = vpt;
  }

  getBBox(inViewport: boolean) {
    return makeBoundingBoxFromPoints(this.getCoords(inViewport));
  }

  getCanvasBBox() {
    return this.getBBox(false);
  }

  getViewportBBox() {
    return this.getBBox(true);
  }

  getDimensionsVector(inViewport: boolean) {
    const { width, height } = this.getBBox(inViewport);
    return new Point(width, height);
  }

  getDimensionsInCanvas() {
    return this.getDimensionsVector(true);
  }

  getDimensionsInViewport() {
    return this.getDimensionsVector(false);
  }

  protected applyTo2D(origin: Point, inViewport: boolean, isVector = false) {
    return origin.transform(
      inViewport
        ? this.transform
        : multiplyTransformMatrices(this.vpt, this.transform),
      isVector
    );
  }

  applyToPointInCanvas(origin: Point) {
    return this.applyTo2D(origin, false);
  }

  applyToPointInViewport(origin: Point) {
    return this.applyTo2D(origin, true);
  }

  applyToVectorInCanvas(origin: Point) {
    return this.applyTo2D(origin, false, true);
  }

  applyToVectorInViewport(origin: Point) {
    return this.applyTo2D(origin, true, true);
  }

  getCoords(inViewport = true) {
    const { tl, tr, br, bl } = inViewport
      ? this.coords
      : mapValues(this.coords, (coord) => coord.transform(this.vpt));
    return Object.assign([tl, tr, br, bl], { tl, tr, br, bl });
  }

  containsPoint(point: Point, inViewport = true) {
    const pointAsOrigin = sendPointToPlane(
      point,
      !inViewport ? this.vpt : undefined,
      this.transform
    );
    return (
      pointAsOrigin.x >= -0.5 &&
      pointAsOrigin.x <= 0.5 &&
      pointAsOrigin.y >= -0.5 &&
      pointAsOrigin.y <= 0.5
    );
  }

  static getCoords(target: ObjectGeometry) {
    return target.bboxCoords;
  }

  static canvas(target: ObjectGeometry) {
    const coords = this.getCoords(target);
    const bbox = makeBoundingBoxFromPoints(Object.values(coords));
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(bbox.width, 0), new Point(0, bbox.height)],
      target.getCenterPoint()
    );
    return new this(coords, transform, target.getViewportTransform());
  }

  static rotated(target: ObjectGeometry) {
    const center = target.getCenterPoint();
    const rotation = degreesToRadians(target.getTotalAngle());
    const coords = this.getCoords(target);
    const bbox = makeBoundingBoxFromPoints(
      Object.values(coords).map((coord) => coord.rotate(-rotation, center))
    );
    const transform = calcBaseChangeMatrix(
      undefined,
      [
        new Point(bbox.width, 0).rotate(rotation),
        new Point(0, bbox.height).rotate(rotation),
      ],
      center
    );
    return new this(coords, transform, target.getViewportTransform());
  }

  static legacy(target: ObjectGeometry) {
    const center = target.getCenterPoint();
    const rotation = degreesToRadians(target.getTotalAngle());
    const coords = this.getCoords(target);
    const viewportBBox = makeBoundingBoxFromPoints(Object.values(coords));
    const rotatedBBox = makeBoundingBoxFromPoints(
      Object.values(coords).map((coord) => coord.rotate(-rotation, center))
    );
    const bboxTransform = calcBaseChangeMatrix(
      undefined,
      [
        new Point(rotatedBBox.width / viewportBBox.width, 0),
        new Point(0, rotatedBBox.height / viewportBBox.height),
      ],
      center
    );
    const legacyCoords = mapValues(coords, (coord) =>
      coord.transform(bboxTransform)
    );
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(1, 0).rotate(rotation), new Point(0, 1).rotate(rotation)],
      center
    );
    return new this(legacyCoords, transform, target.getViewportTransform());
  }

  static transformed(target: ObjectGeometry) {
    const coords = this.getCoords(target);
    const transform = calcBaseChangeMatrix(
      undefined,
      [createVector(coords.tl, coords.tr), createVector(coords.tl, coords.bl)],
      target.getCenterPoint()
    );
    return new this(coords, transform, target.getViewportTransform());
  }

  static build(coords: TCornerPoint, vpt = iMatrix) {
    return new BBox(
      coords,
      calcBaseChangeMatrix(
        undefined,
        [
          createVector(coords.tl, coords.tr),
          createVector(coords.tl, coords.bl),
        ],
        coords.tl.midPointFrom(coords.br)
      ),
      vpt
    );
  }
}

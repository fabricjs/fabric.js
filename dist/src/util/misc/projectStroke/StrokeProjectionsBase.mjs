import { Point } from '../../../Point.mjs';
import { degreesToRadians } from '../radiansDegreesConversion.mjs';
import { createVector } from '../vectors.mjs';

/**
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 * @todo consider removing skewing from points before calculating stroke projection,
 * see https://github.com/fabricjs/fabric.js/commit/494a10ee2f8c2278ae9a55b20bf50cf6ee25b064#commitcomment-94751537
 */
class StrokeProjectionsBase {
  constructor(options) {
    this.options = options;
    this.strokeProjectionMagnitude = this.options.strokeWidth / 2;
    this.scale = new Point(this.options.scaleX, this.options.scaleY);
    this.strokeUniformScalar = this.options.strokeUniform ? new Point(1 / this.options.scaleX, 1 / this.options.scaleY) : new Point(1, 1);
  }

  /**
   * When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
   */
  createSideVector(from, to) {
    const v = createVector(from, to);
    return this.options.strokeUniform ? v.multiply(this.scale) : v;
  }
  projectOrthogonally(from, to, magnitude) {
    return this.applySkew(from.add(this.calcOrthogonalProjection(from, to, magnitude)));
  }
  isSkewed() {
    return this.options.skewX !== 0 || this.options.skewY !== 0;
  }
  applySkew(point) {
    const p = new Point(point);
    // skewY must be applied before skewX as this distortion affects skewX calculation
    p.y += p.x * Math.tan(degreesToRadians(this.options.skewY));
    p.x += p.y * Math.tan(degreesToRadians(this.options.skewX));
    return p;
  }
  scaleUnitVector(unitVector, scalar) {
    return unitVector.multiply(this.strokeUniformScalar).scalarMultiply(scalar);
  }
}

export { StrokeProjectionsBase };
//# sourceMappingURL=StrokeProjectionsBase.mjs.map

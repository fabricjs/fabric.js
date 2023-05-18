import { getEnv } from '../env';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { createCanvasElement } from '../util/misc/dom';
import { isTransparent } from '../util/misc/isTransparent';
import type { SelectableCanvas } from './SelectableCanvas';

/**
 * A util testing if a target is transparent at a given point
 * @override {@link isTargetTransparent} to customize logic
 */
export class TargetFind {
  readonly canvas: SelectableCanvas;
  protected el: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  /**
   * Number of pixels around target pixel to tolerate (consider active) during object detection
   * @type Number
   * @default
   */
  protected tolerance: number;

  constructor(canvas: SelectableCanvas, targetFindTolerance: number) {
    this.canvas = canvas;
    this.el = createCanvasElement();
    this.ctx = this.el.getContext('2d', {
      willReadFrequently: true,
    })!;
    this.setTolerance(targetFindTolerance);
  }

  getTolerance() {
    return this.tolerance;
  }

  /**
   * Set the canvas tolerance value for pixel target find.
   * Use only integer numbers.
   * @private
   */
  setTolerance(value: number) {
    value = Math.round(value);
    this.tolerance = value;
    const retina = this.canvas.getRetinaScaling();
    const size = Math.ceil((value * 2 + 1) * retina);
    this.el.width = this.el.height = size;
    this.ctx.scale(retina, retina);
  }

  /**
   * Render target for pixel testing
   * @override customize target rendering logic. e.g. removing target's shadow etc. **DO NOT** transform {@link ctx}.
   *
   * @param ctx transformed correctly to position {@link target} in the right place
   * @param target
   */
  renderTarget(ctx: CanvasRenderingContext2D, target: FabricObject) {
    const selectionBgc = target.selectionBackgroundColor;
    target.selectionBackgroundColor = '';
    target.render(ctx);
    target.selectionBackgroundColor = selectionBgc;
  }

  /**
   * Returns true if object is transparent at a certain location
   * Clarification: this is `is target transparent at location X or are controls there`
   * @TODO this seems dumb that we treat controls with transparency. we can find controls
   * programmatically without painting them, the cache canvas optimization is always valid
   * @override customize logic, @see {@link renderTarget}. e.g. adding math testing for predictable shapes instead of pixel testing
   *
   * @param {FabricObject} target Object to check
   * @param {Number} x Left coordinate
   * @param {Number} y Top coordinate
   * @return {Boolean}
   */
  isTargetTransparent(target: FabricObject, x: number, y: number): boolean {
    const tolerance = this.tolerance;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.el.width, this.el.height);
    ctx.save();
    ctx.translate(-x + tolerance, -y + tolerance);
    ctx.transform(...this.canvas.viewportTransform);
    this.renderTarget(ctx, target);
    ctx.restore();
    // our canvas is square, and made around tolerance.
    // so tolerance in this case also represent the center of the canvas.
    const enhancedTolerance = Math.round(
      tolerance * this.canvas.getRetinaScaling()
    );
    return isTransparent(
      ctx,
      enhancedTolerance,
      enhancedTolerance,
      enhancedTolerance
    );
  }

  dispose() {
    getEnv().dispose(this.el);
    // @ts-expect-error disposing
    delete this.canvas;
    // @ts-expect-error disposing
    delete this.el;
    // @ts-expect-error disposing
    delete this.ctx;
  }
}

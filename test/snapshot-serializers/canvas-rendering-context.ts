const isCanvasCtx = (val: unknown): val is CanvasRenderingContext2D =>
  // native browser
  (typeof CanvasRenderingContext2D !== 'undefined' &&
    val instanceof CanvasRenderingContext2D) ||
  // node‑canvas / jsdom polyfill: heuristics
  !!(
    val &&
    typeof val === 'object' &&
    typeof (val as any).drawImage === 'function' &&
    (val as any).canvas?.tagName === 'CANVAS'
  );

/**
 * Snapshot serializer that prints a stable, cross‑runtime representation
 * of CanvasRenderingContext2D.
 */
export default {
  test: isCanvasCtx,
  serialize() {
    return 'CanvasRenderingContext2d'
  }
}
;

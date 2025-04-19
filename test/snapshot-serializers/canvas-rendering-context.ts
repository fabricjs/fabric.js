import { Printer, Config, Refs } from 'pretty-format';

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

  serialize(val: any, config: Config, indentation: string, depth: number, refs: Refs, printer: Printer) {
    const canvasClone = val.canvas.cloneNode(true);
    const styleString = canvasClone.getAttribute('style') || '';
    const normalizedStyle = styleString
      .replace('touch-action: none; ', '')
      .replace('touch-action: none;', '')

      .replace('user-select: none; ', '')
      .replace('user-select: none;', '');

    canvasClone.setAttribute('style', normalizedStyle);

    const contextProps = {
      canvas: canvasClone
    };

    if ('createPattern' in val) {
      Object.assign(contextProps, {
        createPattern: '[Function]'
      });
    }

    if ('drawImage' in val) {
      Object.assign(contextProps, {
        drawImage: '[Function]'
      });
    }

    const customConfig = {
      ...config,
      printFunctionName: false
    };

    return printer(contextProps, customConfig, indentation, depth, refs);
  }
}
;

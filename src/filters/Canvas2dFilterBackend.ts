/**
 * Canvas 2D filter backend.
 */
import type { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TPipelineResources } from './typedefs';

export class Canvas2dFilterBackend {
  /**
   * Experimental. This object is a sort of repository of help layers used to avoid
   * of recreating them during frequent filtering. If you are previewing a filter with
   * a slider you probably do not want to create help layers every filter step.
   * in this object there will be appended some canvases, created once, resized sometimes
   * cleared never. Clearing is left to the developer.
   **/
  resources: TPipelineResources = {};

  /**
   * Apply a set of filters against a source image and draw the filtered output
   * to the provided destination canvas.
   *
   * @param {EnhancedFilter} filters The filter to apply.
   * @param {HTMLImageElement|HTMLCanvasElement} sourceElement The source to be filtered.
   * @param {Number} sourceWidth The width of the source input.
   * @param {Number} sourceHeight The height of the source input.
   * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
   */
  applyFilters(
    filters: BaseFilter<string, Record<string, any>>[],
    sourceElement: CanvasImageSource,
    sourceWidth: number,
    sourceHeight: number,
    targetCanvas: HTMLCanvasElement,
  ): T2DPipelineState | void {
    const ctx = targetCanvas.getContext('2d', {
      willReadFrequently: true,
      desynchronized: true,
    });
    if (!ctx) {
      return;
    }
    ctx.drawImage(sourceElement, 0, 0, sourceWidth, sourceHeight);
    const imageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
    const originalImageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
    const pipelineState: T2DPipelineState = {
      sourceWidth,
      sourceHeight,
      imageData,
      originalEl: sourceElement,
      originalImageData,
      canvasEl: targetCanvas,
      ctx,
      filterBackend: this,
    };
    filters.forEach((filter) => {
      filter.applyTo(pipelineState);
    });
    const { imageData: imageDataPostFilter } = pipelineState;
    if (
      imageDataPostFilter.width !== sourceWidth ||
      imageDataPostFilter.height !== sourceHeight
    ) {
      targetCanvas.width = imageDataPostFilter.width;
      targetCanvas.height = imageDataPostFilter.height;
    }
    ctx.putImageData(imageDataPostFilter, 0, 0);
    return pipelineState;
  }
}

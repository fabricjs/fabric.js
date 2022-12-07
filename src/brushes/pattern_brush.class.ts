import { fabric } from '../../HEADER';
import { Pattern } from '../pattern.class';
import { createCanvasElement } from '../util/misc/dom';
import { Canvas } from '../__types__';
import { PencilBrush } from './pencil_brush.class';

export class PatternBrush extends PencilBrush {
  source?: CanvasImageSource;

  constructor(canvas: Canvas) {
    super(canvas);
  }

  getPatternSrc() {
    const dotWidth = 20,
      dotDistance = 5,
      patternCanvas = createCanvasElement(),
      patternCtx = patternCanvas.getContext('2d');

    patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;
    if (patternCtx) {
      patternCtx.fillStyle = this.color;
      patternCtx.beginPath();
      patternCtx.arc(
        dotWidth / 2,
        dotWidth / 2,
        dotWidth / 2,
        0,
        Math.PI * 2,
        false
      );
      patternCtx.closePath();
      patternCtx.fill();
    }
    return patternCanvas;
  }

  /**
   * Creates "pattern" instance property
   * @param {CanvasRenderingContext2D} ctx
   */
  getPattern(ctx: CanvasRenderingContext2D) {
    return ctx.createPattern(this.source || this.getPatternSrc(), 'repeat');
  }

  /**
   * Sets brush styles
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(ctx: CanvasRenderingContext2D) {
    super._setBrushStyles(ctx);
    const pattern = this.getPattern(ctx);
    pattern && (ctx.strokeStyle = pattern);
  }

  /**
   * Creates path
   */
  protected finalizeShape() {
    const path = super.finalizeShape();
    if (path) {
      const topLeft = path._getLeftTopCoords().scalarAdd(path.strokeWidth / 2);
      path.stroke = new Pattern({
        source: this.source || this.getPatternSrc(),
        offsetX: -topLeft.x,
        offsetY: -topLeft.y,
      });
    }
    return path;
  }
}

fabric.PatternBrush = PatternBrush;
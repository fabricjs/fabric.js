//@ts-nocheck

import { Pattern } from "../pattern.class";
import { createCanvasElement } from "../util";
import { PencilBrush } from "./pencil_brush.class";

/**
 * PatternBrush class
 * @class PatternBrush
 * @extends BaseBrush
 */
export class PatternBrush extends PencilBrush {

  getPatternSrc() {

    var dotWidth = 20,
      dotDistance = 5,
      patternCanvas = createCanvasElement(),
      patternCtx = patternCanvas.getContext('2d');

    patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;

    patternCtx.fillStyle = this.color;
    patternCtx.beginPath();
    patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
    patternCtx.closePath();
    patternCtx.fill();

    return patternCanvas;
  }

  getPatternSrcFunction() {
    return String(this.getPatternSrc).replace('this.color', '"' + this.color + '"');
  }

  /**
   * Creates "pattern" instance property
   * @param {CanvasRenderingContext2D} ctx
   */
  getPattern(ctx) {
    return ctx.createPattern(this.source || this.getPatternSrc(), 'repeat');
  }

  /**
   * Sets brush styles
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(ctx) {
    super._setBrushStyles(ctx);
    ctx.strokeStyle = this.getPattern(ctx);
  }

  /**
   * Creates path
   */
  createPath(pathData) {
    var path = super.createPath(pathData),
      topLeft = path._getLeftTopCoords().scalarAdd(path.strokeWidth / 2);

    path.stroke = new Pattern({
      source: this.source || this.getPatternSrcFunction(),
      offsetX: -topLeft.x,
      offsetY: -topLeft.y
    });
    return path;
  }
}

import type { Point } from '../Point';
import { Group } from '../shapes/Group';
import { Shadow } from '../Shadow';
import { Rect } from '../shapes/Rect';
import { getRandomInt } from '../util/internals/getRandomInt';
import type { Canvas } from '../canvas/Canvas';
import { BaseBrush } from './BaseBrush';
import type { SprayBrushPoint } from './typedefs';
import { CENTER } from '../constants';

/**
 *
 * @param rects
 * @returns
 */
function getUniqueRects(rects: Rect[]) {
  const uniqueRects: Record<string, boolean> = {};
  const uniqueRectsArray: Rect[] = [];

  for (let i = 0, key: string; i < rects.length; i++) {
    key = `${rects[i].left}${rects[i].top}`;
    if (!uniqueRects[key]) {
      uniqueRects[key] = true;
      uniqueRectsArray.push(rects[i]);
    }
  }

  return uniqueRectsArray;
}

export class SprayBrush extends BaseBrush {
  /**
   * Width of a spray
   * @type Number
   */
  width = 10;

  /**
   * Density of a spray (number of dots per chunk)
   * @type Number
   */
  density = 20;

  /**
   * Width of spray dots
   * @type Number
   */
  dotWidth = 1;

  /**
   * Width variance of spray dots
   * @type Number
   */
  dotWidthVariance = 1;

  /**
   * Whether opacity of a dot should be random
   * @type Boolean
   */
  randomOpacity = false;

  /**
   * Whether overlapping dots (rectangles) should be removed (for performance reasons)
   * @type Boolean
   */
  optimizeOverlapping = true;

  declare private sprayChunks: SprayBrushPoint[][];

  declare private sprayChunk: SprayBrushPoint[];

  /**
   * Constructor
   * @param {Canvas} canvas
   * @return {SprayBrush} Instance of a spray brush
   */
  constructor(canvas: Canvas) {
    super(canvas);
    this.sprayChunks = [];
    this.sprayChunk = [];
  }

  /**
   * Invoked on mouse down
   * @param {Point} pointer
   */
  onMouseDown(pointer: Point) {
    this.sprayChunks = [];
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();

    this.addSprayChunk(pointer);
    this.renderChunck(this.sprayChunk);
  }

  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(pointer: Point) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    this.addSprayChunk(pointer);
    this.renderChunck(this.sprayChunk);
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;

    const rects: Rect[] = [];

    for (let i = 0; i < this.sprayChunks.length; i++) {
      const sprayChunk = this.sprayChunks[i];
      for (let j = 0; j < sprayChunk.length; j++) {
        const chunck = sprayChunk[j];
        const rect = new Rect({
          width: chunck.width,
          height: chunck.width,
          left: chunck.x + 1,
          top: chunck.y + 1,
          originX: CENTER,
          originY: CENTER,
          fill: this.color,
        });
        rects.push(rect);
      }
    }

    const group = new Group(
      this.optimizeOverlapping ? getUniqueRects(rects) : rects,
      {
        objectCaching: true,
        subTargetCheck: false,
        interactive: false,
      },
    );
    this.shadow && group.set('shadow', new Shadow(this.shadow));
    this.canvas.fire('before:path:created', { path: group });
    this.canvas.add(group);
    this.canvas.fire('path:created', { path: group });

    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  }

  renderChunck(sprayChunck: SprayBrushPoint[]) {
    const ctx = this.canvas.contextTop;
    ctx.fillStyle = this.color;

    this._saveAndTransform(ctx);

    for (let i = 0; i < sprayChunck.length; i++) {
      const point = sprayChunck[i];
      ctx.globalAlpha = point.opacity;
      ctx.fillRect(point.x, point.y, point.width, point.width);
    }

    ctx.restore();
  }

  /**
   * Render all spray chunks
   */
  _render() {
    const ctx = this.canvas.contextTop;
    ctx.fillStyle = this.color;

    this._saveAndTransform(ctx);

    for (let i = 0; i < this.sprayChunks.length; i++) {
      this.renderChunck(this.sprayChunks[i]);
    }
    ctx.restore();
  }

  /**
   * @param {Point} pointer
   */
  addSprayChunk(pointer: Point) {
    this.sprayChunk = [];
    const radius = this.width / 2;

    for (let i = 0; i < this.density; i++) {
      this.sprayChunk.push({
        x: getRandomInt(pointer.x - radius, pointer.x + radius),
        y: getRandomInt(pointer.y - radius, pointer.y + radius),
        width: this.dotWidthVariance
          ? getRandomInt(
              // bottom clamp width to 1
              Math.max(1, this.dotWidth - this.dotWidthVariance),
              this.dotWidth + this.dotWidthVariance,
            )
          : this.dotWidth,
        opacity: this.randomOpacity ? getRandomInt(0, 100) / 100 : 1,
      });
    }

    this.sprayChunks.push(this.sprayChunk);
  }
}

//@ts-nocheck

import { fabric } from "../../HEADER";
import { IPoint, Point } from "../point.class";
import { getRandomInt } from "../util";
import { BaseBrush } from "./base_brush.class";


/**
 * @todo remove transient
 */
const { Group, Rect, Shadow } = fabric;


type SprayPoint = IPoint & {
  width: number;
  opacity: number;
}

export class SprayBrush extends BaseBrush {

  /**
   * Width of a spray
   * @type Number
   * @default
   */
  width = 10

  /**
   * Density of a spray (number of dots per chunk)
   * @type Number
   * @default
   */
  density = 20

  /**
   * Width of spray dots
   * @type Number
   * @default
   */
  dotWidth = 1

  /**
   * Width variance of spray dots
   * @type Number
   * @default
   */
  dotWidthVariance = 1

  /**
   * Whether opacity of a dot should be random
   * @type Boolean
   * @default
   */
  randomOpacity = false

  /**
   * Whether overlapping dots (rectangles) should be removed (for performance reasons)
   * @type Boolean
   * @default
   */
  optimizeOverlapping = true

  private sprayChunks: SprayPoint[][]

  /**
   * Constructor
   * @param {Canvas} canvas
   * @return {SprayBrush} Instance of a spray brush
   */
  constructor(canvas) {
    super(canvas);
    this.sprayChunks = [];
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
    this.renderChunck(this.sprayChunkPoints);
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
    this.renderChunck(this.sprayChunkPoints);
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;

    const rects = [];

    for (let i = 0; i < this.sprayChunks.length; i++) {
      const sprayChunk = this.sprayChunks[i];
      for (let j = 0; j < sprayChunk.length; j++) {
        const chunck = sprayChunk[j];
        const rect = new Rect({
          width: chunck.width,
          height: chunck.width,
          left: chunck.x + 1,
          top: chunck.y + 1,
          originX: 'center',
          originY: 'center',
          fill: this.color
        });
        rects.push(rect);
      }
    }

    const group = new Group(this.optimizeOverlapping ? this._getOptimizedRects(rects) : rects, {
      objectCaching: true,
      layout: 'fixed',
      subTargetCheck: false,
      interactive: false
    });
    this.shadow && group.set('shadow', new Shadow(this.shadow));
    this.canvas.fire('before:path:created', { path: group });
    this.canvas.add(group);
    this.canvas.fire('path:created', { path: group });

    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  }

  /**
   * @private
   * @param {Array} rects
   */
  private _getOptimizedRects(rects) {

    // avoid creating duplicate rects at the same coordinates
    const uniqueRects = {};
    let key;

    for (let i = 0; i < rects.length; i++) {
      key = rects[i].left + '' + rects[i].top;
      if (!uniqueRects[key]) {
        uniqueRects[key] = rects[i];
      }
    }
    const uniqueRectsArray = [];
    for (key in uniqueRects) {
      uniqueRectsArray.push(uniqueRects[key]);
    }

    return uniqueRectsArray;
  }

  renderChunck(sprayChunck: SprayPoint[]) {
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
    this.sprayChunkPoints = [];
    const radius = this.width / 2;

    for (let i = 0; i < this.density; i++) {
      this.sprayChunkPoints.push({
        x: getRandomInt(pointer.x - radius, pointer.x + radius),
        y: getRandomInt(pointer.y - radius, pointer.y + radius),
        width: this.dotWidthVariance ?
          getRandomInt(
            // bottom clamp width to 1
            Math.max(1, this.dotWidth - this.dotWidthVariance),
            this.dotWidth + this.dotWidthVariance) :
          this.dotWidth,
        opacity: this.randomOpacity ? getRandomInt(0, 100) / 100 : 1
      });
    }

    this.sprayChunks.push(this.sprayChunkPoints);
  }
}

fabric.SprayBrush = SprayBrush;
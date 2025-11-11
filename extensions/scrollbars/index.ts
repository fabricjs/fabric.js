import type { TMat2D, TPointerEvent } from 'fabric';
import { Canvas, util } from 'fabric';
import type {
  ScrollbarProps,
  ScrollbarsProps,
  ScrollbarXProps,
  ScrollbarYProps,
} from './typedefs';

export class Scrollbars {
  canvas: Canvas;
  /** Scrollbar fill color */
  fill = 'rgba(0,0,0,.3)';
  /** Scrollbar stroke color */
  stroke = 'rgba(255,255,255,.3)';
  /** Scrollbar line width */
  lineWidth = 1;
  /** Hide horizontal scrollbar */
  hideX = false;
  /** Hide vertical scrollbar */
  hideY = false;
  /** Scrollbar minimum width */
  scrollbarMinWidth = 40;
  /** Scrollbar size */
  scrollbarSize = 5;
  /** Scrollbar distance from the boundary */
  scrollSpace = 4;
  /** Scrollbar expansion size, the distance from which the user can effectively slide the scrollbar */
  padding = 4;

  /** The scrollbar currently hit */
  private _bar?: { type: string; start: number; vpt: TMat2D };
  /** The current area that can hit the scrollbar */
  private _barViewport = {
    left: 1,
    right: -1,
    top: 1,
    bottom: -1,
    sx: 1,
    sy: 1,
  };

  constructor(canvas: Canvas, props: ScrollbarsProps = {}) {
    this.canvas = canvas;
    Object.assign(this, props);

    this.canvas.__onMouseDown = this.mouseDownHandler.bind(this);
    this.canvas.__onMouseMove = this.mouseMoveHandler.bind(this);
    this.canvas.__onMouseUp = this.mouseUpHandler.bind(this);
    this.beforeRenderHandler = this.beforeRenderHandler.bind(this);
    this.afterRenderHandler = this.afterRenderHandler.bind(this);

    this.initBehavior();
  }
  initBehavior() {
    this.canvas.on('before:render', this.beforeRenderHandler);
    this.canvas.on('after:render', this.afterRenderHandler);
  }
  getScrollbar(e: TPointerEvent) {
    const p = this.canvas.getViewportPoint(e);
    const vpt = this.canvas.viewportTransform.slice(0) as TMat2D;
    if (!this.hideX) {
      const b =
        p.x > this._barViewport.left &&
        p.x < this._barViewport.right &&
        p.y >
          this.canvas.height -
            this.scrollbarSize -
            this.scrollSpace -
            this.padding &&
        p.y < this.canvas.height - this.scrollSpace + this.padding;

      if (b) return { type: 'x', start: p.x, vpt };
    }
    if (!this.hideY) {
      const b =
        p.y > this._barViewport.top &&
        p.y < this._barViewport.bottom &&
        p.x >
          this.canvas.width -
            this.scrollbarSize -
            this.scrollSpace -
            this.padding &&
        p.x < this.canvas.width - this.scrollSpace + this.padding;

      if (b) return { type: 'y', start: p.y, vpt };
    }
  }
  mouseDownHandler(e: TPointerEvent) {
    this._bar = this.getScrollbar(e);
    if (!this._bar) return Canvas.prototype.__onMouseDown.call(this.canvas, e);
  }
  mouseMoveHandler(e: TPointerEvent) {
    // When the mouse is not pressed and the mouse is in the scrollbar area, it will trigger the object's mouse:over/mouse:out, but it cannot select the object (because pressing the mouse will select the scrollbar).
    // For the simplicity of the code, this situation is not judged, it does not affect the use
    if (!this._bar) return Canvas.prototype.__onMouseMove.call(this.canvas, e);
    const p = this.canvas.getViewportPoint(e);
    const s =
      this._bar.type == 'x' ? this._barViewport.sx : this._barViewport.sy;
    const n = this._bar.type == 'x' ? 4 : 5;
    const end = this._bar.type == 'x' ? p.x : p.y;
    const vpt = this._bar.vpt.slice(0) as TMat2D;
    vpt[n] -= (end - this._bar.start) * s;

    this.canvas.setViewportTransform(vpt);
    this.canvas.requestRenderAll();
  }
  mouseUpHandler(e: TPointerEvent) {
    if (!this._bar) Canvas.prototype.__onMouseUp.call(this.canvas, e);
    delete this._bar;
  }
  beforeRenderHandler() {
    const ctx = this.canvas.contextTop;
    // Clear horizontal scrollbar
    if (!this.hideX) {
      ctx.clearRect(
        this.scrollSpace - this.lineWidth / 2,
        this.canvas.height -
          this.scrollbarSize -
          this.scrollSpace -
          this.lineWidth / 2,
        this.canvas.width - this.scrollSpace * 2 + this.lineWidth,
        this.scrollbarSize + this.lineWidth,
      );
    }

    // Clear vertical scrollbar
    if (!this.hideY) {
      ctx.clearRect(
        this.canvas.width -
          this.scrollbarSize -
          this.scrollSpace -
          this.lineWidth / 2,
        this.scrollSpace - this.lineWidth / 2,
        this.scrollbarSize + this.lineWidth,
        this.canvas.height - this.scrollSpace * 2 + this.lineWidth,
      );
    }
  }
  afterRenderHandler() {
    const { tl, br } = this.canvas.vptCoords;
    /** Visible area */
    const mapRect = { left: tl.x, top: tl.y, right: br.x, bottom: br.y };
    /** The area where all shapes are located */
    const objectRect = this.getObjectsBoundingRect();
    if (objectRect.left > mapRect.left) objectRect.left = mapRect.left;
    if (objectRect.top > mapRect.top) objectRect.top = mapRect.top;
    if (objectRect.bottom < mapRect.bottom) objectRect.bottom = mapRect.bottom;
    if (objectRect.right < mapRect.right) objectRect.right = mapRect.right;

    this.render(this.canvas.contextTop, mapRect, objectRect);
  }
  render(
    ctx: CanvasRenderingContext2D,
    mapRect: ScrollbarProps,
    objectRect: ScrollbarProps,
  ) {
    ctx.save();
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.lineWidth;

    // Draw horizontal scrollbar
    if (!this.hideX) this.drawScrollbarX(ctx, mapRect, objectRect);
    // Draw vertical scrollbar
    if (!this.hideY) this.drawScrollbarY(ctx, mapRect, objectRect);

    ctx.restore();
  }
  drawScrollbarX(
    ctx: CanvasRenderingContext2D,
    mapRect: ScrollbarXProps,
    objectRect: ScrollbarXProps,
  ) {
    const mapWidth = mapRect.right - mapRect.left;
    const objectWidth = objectRect.right - objectRect.left;
    if (mapWidth == objectWidth) {
      this._barViewport.left = 1;
      this._barViewport.right = -1;
      this._barViewport.sx = 1;
      return;
    }

    const scaleX = Math.min(mapWidth / objectWidth, 1);
    const w = this.canvas.width - this.scrollbarSize - this.scrollSpace * 2;
    const width = Math.max((w * scaleX) | 0, this.scrollbarMinWidth);
    const left =
      ((mapRect.left - objectRect.left) / (objectWidth - mapWidth)) *
      (w - width);

    const x = this.scrollSpace + left;
    const y = this.canvas.height - this.scrollbarSize - this.scrollSpace;
    this._barViewport.left = x;
    this._barViewport.right = x + width;
    this._barViewport.sx = objectWidth / mapWidth;

    this.drawRect(ctx, {
      x,
      y,
      w: width,
      h: this.scrollbarSize,
    });
  }
  drawScrollbarY(
    ctx: CanvasRenderingContext2D,
    mapRect: ScrollbarYProps,
    objectRect: ScrollbarYProps,
  ) {
    const mapHeight = mapRect.bottom - mapRect.top;
    const objectHeight = objectRect.bottom - objectRect.top;
    if (mapHeight == objectHeight) {
      this._barViewport.top = 1;
      this._barViewport.bottom = -1;
      this._barViewport.sy = 1;
    }

    const scaleY = Math.min(mapHeight / objectHeight, 1);
    const h = this.canvas.height - this.scrollbarSize - this.scrollSpace * 2;
    const height = Math.max((h * scaleY) | 0, this.scrollbarMinWidth);
    const top =
      ((mapRect.top - objectRect.top) / (objectHeight - mapHeight)) *
      (h - height);

    const x = this.canvas.width - this.scrollbarSize - this.scrollSpace;
    const y = this.scrollSpace + top;
    this._barViewport.top = y;
    this._barViewport.bottom = y + height;
    this._barViewport.sy = objectHeight / mapHeight;
    this.drawRect(ctx, {
      x,
      y,
      w: this.scrollbarSize,
      h: height,
    });
  }
  drawRect(
    ctx: CanvasRenderingContext2D,
    props: { x: number; y: number; w: number; h: number },
  ) {
    const { x, y, w, h } = props;
    const r = Math.min(w, h) / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  getObjectsBoundingRect() {
    const objects = this.canvas.getObjects();
    const { left, top, width, height } = util.makeBoundingBoxFromPoints(
      objects.map((x) => x.getCoords()).flat(1),
    );
    return { left, top, right: left + width, bottom: top + height };
  }

  dispose() {
    // @ts-expect-error: In the initialization, __onMouseDown was overridden, here it is restored
    delete this.canvas.__onMouseDown;
    // @ts-expect-error: In the initialization, __onMouseMove was overridden, here it is restored
    delete this.canvas.__onMouseMove;
    // @ts-expect-error: In the initialization, __onMouseUp was overridden, here it is restored
    delete this.canvas.__onMouseUp;
    this.canvas.off('before:render', this.beforeRenderHandler);
    this.canvas.off('after:render', this.afterRenderHandler);
  }
}

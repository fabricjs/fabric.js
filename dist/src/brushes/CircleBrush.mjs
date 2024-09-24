import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Color } from '../color/Color.mjs';
import { Shadow } from '../Shadow.mjs';
import { Circle } from '../shapes/Circle.mjs';
import { Group } from '../shapes/Group.mjs';
import { getRandomInt } from '../util/internals/getRandomInt.mjs';
import { BaseBrush } from './BaseBrush.mjs';
import { CENTER } from '../constants.mjs';

class CircleBrush extends BaseBrush {
  constructor(canvas) {
    super(canvas);
    /**
     * Width of a brush
     * @type Number
     * @default
     */
    _defineProperty(this, "width", 10);
    this.points = [];
  }

  /**
   * Invoked inside on mouse down and mouse move
   * @param {Point} pointer
   */
  drawDot(pointer) {
    const point = this.addPoint(pointer),
      ctx = this.canvas.contextTop;
    this._saveAndTransform(ctx);
    this.dot(ctx, point);
    ctx.restore();
  }
  dot(ctx, point) {
    ctx.fillStyle = point.fill;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Invoked on mouse down
   */
  onMouseDown(pointer) {
    this.points = [];
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();
    this.drawDot(pointer);
  }

  /**
   * Render the full state of the brush
   * @private
   */
  _render() {
    const ctx = this.canvas.contextTop,
      points = this.points;
    this._saveAndTransform(ctx);
    for (let i = 0; i < points.length; i++) {
      this.dot(ctx, points[i]);
    }
    ctx.restore();
  }

  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(pointer) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    if (this.needsFullRender()) {
      this.canvas.clearContext(this.canvas.contextTop);
      this.addPoint(pointer);
      this._render();
    } else {
      this.drawDot(pointer);
    }
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;
    const circles = [];
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i],
        circle = new Circle({
          radius: point.radius,
          left: point.x,
          top: point.y,
          originX: CENTER,
          originY: CENTER,
          fill: point.fill
        });
      this.shadow && (circle.shadow = new Shadow(this.shadow));
      circles.push(circle);
    }
    const group = new Group(circles, {
      canvas: this.canvas
    });
    this.canvas.fire('before:path:created', {
      path: group
    });
    this.canvas.add(group);
    this.canvas.fire('path:created', {
      path: group
    });
    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  }

  /**
   * @param {Object} pointer
   * @return {Point} Just added pointer point
   */
  addPoint(_ref) {
    let {
      x,
      y
    } = _ref;
    const pointerPoint = {
      x,
      y,
      radius: getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
      fill: new Color(this.color).setAlpha(getRandomInt(0, 100) / 100).toRgba()
    };
    this.points.push(pointerPoint);
    return pointerPoint;
  }
}

export { CircleBrush };
//# sourceMappingURL=CircleBrush.mjs.map

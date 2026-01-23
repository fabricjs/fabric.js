import { type Canvas, type FabricObject, Point } from 'fabric';

type MovingEvent = { target: FabricObject };

export type CenteringGuidelinesConfig = {
  /** Margin in pixels for snap detection */
  margin: number;
  /** Line color */
  color: string;
  /** Line width */
  width: number;
};

export class CenteringGuidelines {
  canvas: Canvas;
  margin = 4;
  color = 'rgba(255,0,241,0.5)';
  width = 1;

  private isInVerticalCenter = false;
  private isInHorizontalCenter = false;
  private viewportTransform: number[] = [1, 0, 0, 1, 0, 0];

  constructor(canvas: Canvas, options: Partial<CenteringGuidelinesConfig> = {}) {
    this.canvas = canvas;
    Object.assign(this, options);

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.objectMoving = this.objectMoving.bind(this);
    this.beforeRender = this.beforeRender.bind(this);
    this.afterRender = this.afterRender.bind(this);

    this.canvas.on('mouse:down', this.mouseDown);
    this.canvas.on('mouse:up', this.mouseUp);
    this.canvas.on('object:moving', this.objectMoving);
    this.canvas.on('before:render', this.beforeRender);
    this.canvas.on('after:render', this.afterRender);
  }

  private get canvasWidthCenter() {
    return this.canvas.getWidth() / 2;
  }

  private get canvasHeightCenter() {
    return this.canvas.getHeight() / 2;
  }

  private isNearCenter(value: number, center: number): boolean {
    return Math.abs(Math.round(value) - Math.round(center)) <= this.margin;
  }

  private mouseDown() {
    this.viewportTransform = this.canvas.viewportTransform;
  }

  private mouseUp() {
    this.isInVerticalCenter = false;
    this.isInHorizontalCenter = false;
    this.canvas.renderAll();
  }

  private objectMoving(e: MovingEvent) {
    const object = e.target;
    const objectCenter = object.getCenterPoint();

    this.isInVerticalCenter = this.isNearCenter(
      objectCenter.x,
      this.canvasWidthCenter,
    );
    this.isInHorizontalCenter = this.isNearCenter(
      objectCenter.y,
      this.canvasHeightCenter,
    );

    if (this.isInVerticalCenter || this.isInHorizontalCenter) {
      object.setPositionByOrigin(
        new Point(
          this.isInVerticalCenter ? this.canvasWidthCenter : objectCenter.x,
          this.isInHorizontalCenter ? this.canvasHeightCenter : objectCenter.y,
        ),
        'center',
        'center',
      );
    }
  }

  private beforeRender() {
    if (this.canvas.contextTop) {
      this.canvas.clearContext(this.canvas.contextTop);
    }
  }

  private afterRender() {
    if (this.isInVerticalCenter) {
      this.drawVerticalCenterLine();
    }
    if (this.isInHorizontalCenter) {
      this.drawHorizontalCenterLine();
    }
  }

  private drawVerticalCenterLine() {
    this.drawLine(
      this.canvasWidthCenter + 0.5,
      0,
      this.canvasWidthCenter + 0.5,
      this.canvas.getHeight(),
    );
  }

  private drawHorizontalCenterLine() {
    this.drawLine(
      0,
      this.canvasHeightCenter + 0.5,
      this.canvas.getWidth(),
      this.canvasHeightCenter + 0.5,
    );
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    const ctx = this.canvas.getSelectionContext();
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(x1 * this.viewportTransform[0], y1 * this.viewportTransform[3]);
    ctx.lineTo(x2 * this.viewportTransform[0], y2 * this.viewportTransform[3]);
    ctx.stroke();
    ctx.restore();
  }

  dispose() {
    this.canvas.off('mouse:down', this.mouseDown);
    this.canvas.off('mouse:up', this.mouseUp);
    this.canvas.off('object:moving', this.objectMoving);
    this.canvas.off('before:render', this.beforeRender);
    this.canvas.off('after:render', this.afterRender);
  }
}

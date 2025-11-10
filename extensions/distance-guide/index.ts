import type {
  BasicTransformEvent,
  Canvas,
  FabricObject,
  TPointerEventInfo,
} from 'fabric';
import { getFabricWindow } from 'fabric';
import type {
  AltMap,
  DistanceGuideProps,
  DrawLineMapProps,
  MovingMap,
} from './typedefs';
import type { DrawTextProps } from './util';
import {
  drawAltMap,
  drawLineMap,
  drawMovingMap,
  drawText,
  moving,
  setAltMap,
} from './util';

export type { DistanceGuideProps };
export class DistanceGuide {
  canvas: Canvas;
  /** The color of the guide line */
  color = 'rgba(255,0,0,0.9)';
  /** The fill color of the text */
  fillStyle = 'rgba(255,255,255,1)';
  /** The width of the guide line */
  lineWidth = 1;
  /** The style of the dashed line */
  lineDash = [6, 2];
  /** The offset of the dashed line */
  lineDashOffset = 3;
  /** The size of the text */
  fontSize = 11;
  /** The fontFamily of the text */
  fontFamily = 'sans-serif';
  /** The spacing of the text within the rectangle */
  padding = 4;
  /** The distance between the text and the guide line */
  space = 5;
  /** The detection distance when moving the graphic */
  margin = 8;

  altMap?: AltMap;
  movingMap?: MovingMap;

  private target?: FabricObject;

  constructor(canvas: Canvas, options: Partial<DistanceGuideProps> = {}) {
    this.canvas = canvas;
    Object.assign(this, options);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.moving = this.moving.bind(this);
    this.beforeRender = this.beforeRender.bind(this);
    this.afterRender = this.afterRender.bind(this);
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    this.initBehavior();
  }
  initBehavior() {
    this.canvas.on('mouse:over', this.mouseOver);
    this.canvas.on('mouse:out', this.mouseOut);
    this.canvas.on('mouse:down', this.mouseDown);
    this.canvas.on('object:moving', this.moving);
    this.canvas.on('before:render', this.beforeRender);
    this.canvas.on('after:render', this.afterRender);
    const win = getFabricWindow();
    win.addEventListener('keydown', this.keydown);
    win.addEventListener('keyup', this.keyup);
  }
  mouseDown() {
    delete this.altMap;
    this.canvas.once('mouse:up', () => {
      delete this.movingMap;
    });
  }
  moving(e: BasicTransformEvent & { target: FabricObject }) {
    moving.call(this, e);
  }
  beforeRender() {
    this.canvas.clearContext(this.canvas.contextTop);
  }
  afterRender() {
    drawAltMap.call(this);
    drawMovingMap.call(this);
  }
  mouseOver(e: TPointerEventInfo) {
    const target = e.target;
    this.target = target?.selectable ? target : undefined;
    if (!e.e.altKey) return;
    this.setAltMap();
    this.canvas.requestRenderAll();
  }
  mouseOut(e: TPointerEventInfo) {
    this.target = undefined;
    if (!e.e.altKey) return;
    delete this.altMap;
    this.canvas.requestRenderAll();
  }
  keydown(e: KeyboardEvent) {
    if (e.key != 'Alt') return;
    this.setAltMap();
    this.canvas.requestRenderAll();
  }
  keyup(e: KeyboardEvent) {
    if (e.key != 'Alt') return;
    delete this.altMap;
    this.canvas.requestRenderAll();
  }
  setAltMap(origin = this.canvas._activeObject, target = this.target) {
    setAltMap.call(this, origin, target);
  }
  drawLineMap(props: DrawLineMapProps) {
    drawLineMap.call(this, props);
  }
  drawText(props: DrawTextProps) {
    drawText.call(this, props);
  }
  dispose() {
    this.canvas.off('mouse:over', this.mouseOver);
    this.canvas.off('mouse:out', this.mouseOut);
    this.canvas.off('mouse:down', this.mouseDown);
    this.canvas.off('object:moving', this.moving);
    this.canvas.off('before:render', this.beforeRender);
    this.canvas.off('after:render', this.afterRender);
    const win = getFabricWindow();
    win.removeEventListener('keydown', this.keydown);
    win.removeEventListener('keyup', this.keyup);
  }
}

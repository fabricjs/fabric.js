import { CommonMethods } from "./fabric-sink";

import { Image, ImageOptions } from "./shapes/image";
import { Observable } from "./mixin/observable";
import { Point } from "./point";
import { Collection } from "./mixin/collection";


export interface StaticCanvasOptions {
  backgroundColor?: string;
  backgroundImage?: any; // todo
  overlayColor?: string; // todo
  overlayImage?: any; // todo
  includeDefaultValues?: boolean;
  stateful?: boolean;
  renderOnAddRemove?: boolean;
  clipTo?: any; // todo
  controlsAboveOverlay?: boolean;
  allowTouchScrolling?: boolean;
  imageSmoothingEnabled?: boolean;
  viewportTransform?: any; // todo: fabric.iMatrix.concat(),
  backgroundVpt?: boolean;
  overlayVpt?: boolean;
  enableRetinaScaling?: boolean;
  vptCoords?: any; // todo
  skipOffscreen?: boolean;
}

export interface StaticCanvas extends CommonMethods, Collection, StaticCanvasOptions, Observable<StaticCanvas> {}
export class StaticCanvas {
  constructor(options?: StaticCanvasOptions);

  onBeforeScaleRotate() : Function;
  getRetinaScaling() : number;
  calcOffset(): StaticCanvas;
  setOverlayImage(image: string | Image, callback?: (image: Image) => void, options?: ImageOptions): StaticCanvas;

  setBackgroundImage(image: string | Image, callback?: (image: Image) => void, options?: ImageOptions): StaticCanvas;

  setOverlayColor(overlayColor: string, callback?: () => void): StaticCanvas;
  setBackgroundColor(backgroundColor: string, callback?: () => void): StaticCanvas;

  getWidth(): number;
  getHeight(): number;

  setWidth(value: number, options?: { cssOnly?: boolean; backstoreOnly?: boolean }): StaticCanvas;
  setHeight(value: number, options?: { cssOnly?: boolean; backstoreOnly?: boolean }): StaticCanvas;

  setDimensions(dimensions: any, options: { cssOnly?: boolean; backstoreOnly?: boolean }): StaticCanvas; // todo dimensions

  getZoom(): number;
  setViewportTransform(vpt: any) : StaticCanvas; // todo
  zoomToPoint(point: Point, value: number) : StaticCanvas;
  setZoom(value: number) : StaticCanvas;
  absolutePan(point: Point) : StaticCanvas;
  relativePan(point: Point) : StaticCanvas;
  getElement(): any; // todo
  clearContext(ctx: any): StaticCanvas; // todo
  getContext(): any;
  clear(): StaticCanvas;
  renderAll(): StaticCanvas;
  renderAndReset(): void;
  requestRenderAll(): StaticCanvas;
  calcViewportBoundaries(): { tl: Point, br: Point, tr: Point, bl: Point };
  renderCanvas(ctx: any, objects: any): void; // todo
  getCenter(): { top: number, left: number };
  centerObjectH(object: Object) : StaticCanvas;
  centerObjectV(object: Object) : StaticCanvas;
  centerObject(object: Object) : StaticCanvas;
  viewportCenterObject(object: Object) : StaticCanvas;
  viewportCenterObjectH(object: Object) : StaticCanvas;
  viewportCenterObjectV(object: Object) : StaticCanvas;
  getVpCenter(): Point;

  toDatalessJSON<T extends keyof this>(propertiesToInclude: (keyof T)[]): any; //todo
  toObject<T extends keyof this>(propertiesToInclude?: (keyof T)[]): any; //todo
  toDatalessObject<T extends keyof this>(propertiesToInclude: (keyof T)[]): any; //todo

  svgViewportTransformation: boolean;
  toSVG(options: any, reviver: any): string; // todo
  createSVGRefElementsMarkup() : string;
  createSVGFontFacesMarkup() : string;
  sendToBack(object: Object) : StaticCanvas;
  bringToFront(object: Object) : StaticCanvas;
  sendBackwards(object: Object, intersecting: any) : StaticCanvas;
  bringForward(object: Object, intersecting: any) : StaticCanvas;
  moveTo(object: Object, index: number) : StaticCanvas; // todo return value?
  dispose() : StaticCanvas;
  toString(): string;
}

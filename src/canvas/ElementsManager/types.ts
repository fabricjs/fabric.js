export type TCanvasSizeOptions = {
  backstoreOnly?: boolean;
  cssOnly?: boolean;
  retinaScaling?: number;
};

export type CanvasItem = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

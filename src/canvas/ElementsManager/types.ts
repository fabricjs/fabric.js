export type TCanvasSizeOptions = {
  backstoreOnly?: boolean;
  cssOnly?: boolean;
};

export type CanvasItem = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

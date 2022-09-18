import { Canvas, TObject } from './__types__';

export type TRenderingContext = {
  /**
   * object/canvas being clipped by the rendering process
   */
  clipping?: {
    source: TObject;
    destination: TObject | Canvas;
  };
  /**
   * object being cached by the rendering process
   */
  caching?: TObject;
  /**
   * By default fabric checks if an object is included in the viewport before rendering.
   * This flag overrides the check and forces rendering to occur.
   */
  force?: boolean;
};

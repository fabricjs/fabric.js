import { iMatrix } from '../constants';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { TFiller, TMat2D, TOptions } from '../typedefs';

export interface StaticCanvasOptions {
  backgroundVpt: boolean;
  backgroundColor: TFiller | string;
  backgroundImage?: FabricObject;
  overlayVpt: boolean;
  overlayColor: TFiller | string;
  overlayImage?: FabricObject;
  includeDefaultValues: boolean;
  renderOnAddRemove: boolean;
  controlsAboveOverlay: boolean;
  allowTouchScrolling: boolean;
  imageSmoothingEnabled: boolean;
  viewportTransform: TMat2D;
  enableRetinaScaling: boolean;
  svgViewportTransformation: boolean;
  skipOffscreen: boolean;
  clipPath?: FabricObject;
}

export const staticCanvasDefaults: TOptions<StaticCanvasOptions> = {
  backgroundVpt: true,
  backgroundColor: '',
  overlayVpt: true,
  overlayColor: '',
  includeDefaultValues: true,
  renderOnAddRemove: true,
  controlsAboveOverlay: false,
  allowTouchScrolling: false,
  imageSmoothingEnabled: true,
  viewportTransform: [...iMatrix],
  enableRetinaScaling: true,
  svgViewportTransformation: true,
  skipOffscreen: true,
  clipPath: undefined,
};

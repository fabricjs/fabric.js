import { iMatrix } from '../constants.mjs';

const staticCanvasDefaults = {
  backgroundVpt: true,
  backgroundColor: '',
  overlayVpt: true,
  overlayColor: '',
  includeDefaultValues: true,
  svgViewportTransformation: true,
  renderOnAddRemove: true,
  skipOffscreen: true,
  enableRetinaScaling: true,
  imageSmoothingEnabled: true,
  /**
   * @todo move to Canvas
   */
  controlsAboveOverlay: false,
  /**
   * @todo move to Canvas
   */
  allowTouchScrolling: false,
  viewportTransform: [...iMatrix]
};

export { staticCanvasDefaults };
//# sourceMappingURL=StaticCanvasOptions.mjs.map

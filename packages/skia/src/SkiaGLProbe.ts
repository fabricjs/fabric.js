import { GLProbe } from '@fabricjs/core';

export class SkiaGLProbe extends GLProbe {
  queryWebGL() {
    // The Skia backend uses Fabric's Canvas2D filters.
  }
  isSupported() {
    return false;
  }
}

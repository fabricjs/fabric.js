// First we set the env variable

import { setEnv } from './src/env';
import { getEnv, getNodeCanvas } from './src/env/node';

setEnv(getEnv());

// After the env is set we can export everything and expose specific node functionality

import type { JpegConfig, PngConfig } from 'canvas';
import type { StaticCanvasOptions, TOptions } from './fabric';
import {
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
} from './fabric';
import { FabricObject as FabricObjectBase } from './src/shapes/Object/Object';

FabricObjectBase.ownDefaults.objectCaching = false;

export * from './fabric';

type NodeStaticCanvasOptions = {
  patternQuality: PatternQuality;
};

const staticCanvasDefaults: TOptions<
  StaticCanvasOptions & NodeStaticCanvasOptions
> = {
  ...StaticCanvasBase.ownDefaults,
  patternQuality: 'best',
};

export class StaticCanvas extends StaticCanvasBase {
  declare patternQuality: PatternQuality;

  static ownDefaults: TOptions<StaticCanvasOptions & NodeStaticCanvasOptions> =
    staticCanvasDefaults;

  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(opts?: PngConfig) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
}

/**
 * **NOTICE**:
 * {@link Canvas} is designed for interactivity.
 * Therefore, using it in node has no benefit.
 * Use {@link StaticCanvas} instead.
 */
export class Canvas extends CanvasBase {
  declare patternQuality: PatternQuality;

  static ownDefaults: TOptions<StaticCanvasOptions & NodeStaticCanvasOptions> =
    staticCanvasDefaults;

  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(opts?: PngConfig) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
}

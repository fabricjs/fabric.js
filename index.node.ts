// First we set the env variable

import { setEnv } from './src/env';
import { getEnv, getNodeCanvas } from './src/env/node';

setEnv(getEnv());

// After the env is set we can export everything and expose specific node functionality

import {
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
} from './fabric';
import { FabricObject as FabricObjectBase } from './src/shapes/Object/Object';

/**
 * PNG encoding configuration options.
 * Note: Only a subset of options are supported by @napi-rs/canvas.
 * Unsupported options are accepted for API compatibility but ignored.
 */
export interface PngConfig {
  /** Compression level (0-9). Not supported by @napi-rs/canvas. */
  compressionLevel?: number;
  /** PNG filters. Not supported by @napi-rs/canvas. */
  filters?: number;
  /** Palette for indexed PNGs. Not supported by @napi-rs/canvas. */
  palette?: Uint8ClampedArray;
  /** Background index for indexed PNGs. Not supported by @napi-rs/canvas. */
  backgroundIndex?: number;
  /** Resolution in pixels per meter. Not supported by @napi-rs/canvas. */
  resolution?: number;
}

/**
 * JPEG encoding configuration options.
 * Note: Only `quality` is supported by @napi-rs/canvas.
 * Other options are accepted for API compatibility but ignored.
 */
export interface JpegConfig {
  /** Quality (0-1 or 0-100). Supported by @napi-rs/canvas. */
  quality?: number;
  /** Progressive JPEG. Not supported by @napi-rs/canvas. */
  progressive?: boolean;
  /** Chroma subsampling. Not supported by @napi-rs/canvas. */
  chromaSubsampling?: boolean;
}

FabricObjectBase.ownDefaults.objectCaching = false;

export * from './fabric';
export class StaticCanvas extends StaticCanvasBase {
  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(opts?: PngConfig) {
    // @napi-rs/canvas doesn't support PNG options, but we accept them for API compatibility
    return this.getNodeCanvas().encodeStream('png');
  }
  createJPEGStream(opts?: JpegConfig) {
    // @napi-rs/canvas only supports quality option
    // Normalize quality: node-canvas uses 0-1, @napi-rs/canvas uses 0-100
    const quality =
      opts?.quality !== undefined
        ? opts.quality <= 1
          ? Math.round(opts.quality * 100)
          : opts.quality
        : undefined;
    return this.getNodeCanvas().encodeStream('jpeg', quality);
  }
}

/**
 * **NOTICE**:
 * {@link Canvas} is designed for interactivity.
 * Therefore, using it in node has no benefit.
 * Use {@link StaticCanvas} instead.
 */
export class Canvas extends CanvasBase {
  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(opts?: PngConfig) {
    // @napi-rs/canvas doesn't support PNG options, but we accept them for API compatibility
    return this.getNodeCanvas().encodeStream('png');
  }
  createJPEGStream(opts?: JpegConfig) {
    // @napi-rs/canvas only supports quality option
    // Normalize quality: node-canvas uses 0-1, @napi-rs/canvas uses 0-100
    const quality =
      opts?.quality !== undefined
        ? opts.quality <= 1
          ? Math.round(opts.quality * 100)
          : opts.quality
        : undefined;
    return this.getNodeCanvas().encodeStream('jpeg', quality);
  }
}

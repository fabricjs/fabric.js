import type { Readable } from 'node:stream';
import type { Canvas as SkiaCanvas } from '@napi-rs/canvas';
import {
  PNGStream as CompatPNGStream,
  JPEGStream as CompatJPEGStream,
} from '@napi-rs/canvas/node-canvas.js';
import type { PngConfig, JpegConfig } from '@napi-rs/canvas/node-canvas.js';

type StreamConstructor<Config> = new (
  canvas: SkiaCanvas,
  options?: Config,
) => Readable;

// The compatibility classes accept a native canvas at runtime, but v1.1.0's
// declarations omit their constructor signatures. Do not modify native prototypes.
const PNGStream = CompatPNGStream as unknown as StreamConstructor<PngConfig>;
const JPEGStream = CompatJPEGStream as unknown as StreamConstructor<JpegConfig>;

export const createPNGStream = (canvas: SkiaCanvas, options?: PngConfig) =>
  new PNGStream(canvas, options);

export const createJPEGStream = (canvas: SkiaCanvas, options?: JpegConfig) => {
  const quality = options?.quality;
  if (
    quality !== undefined &&
    (!Number.isFinite(quality) || quality < 0 || quality > 1)
  ) {
    throw new RangeError(
      'JPEG quality must be a finite number between 0 and 1',
    );
  }
  return new JPEGStream(canvas, options);
};

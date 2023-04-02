// first we set the env variable by importing the node env file
import './src/env/node';

import type {
  Canvas as NodeCanvas,
  JpegConfig,
  JPEGStream,
  PdfConfig,
  PDFStream,
  PngConfig,
  PNGStream,
} from 'canvas';
import { StaticCanvas as StaticCanvasBase } from './fabric';
import { FabricObject } from './src/shapes/Object/Object';
import { TSize } from './src/typedefs';

FabricObject.ownDefaults.objectCaching = false;

export * from './fabric';

export type StreamSpec = {
  png: { options: PngConfig; stream: PNGStream };
  jpeg: { options: JpegConfig; stream: JPEGStream };
  pdf: { options: PdfConfig; stream: PDFStream };
};

export class StaticCanvas extends StaticCanvasBase {
  declare lowerCanvasEl: NodeCanvas;

  protected _setDimensionsImpl(dimensions: Partial<TSize>): void {
    super._setDimensionsImpl(dimensions, {
      cssOnly: false,
      backstoreOnly: true,
    });
  }

  /**
   * @deprecated use {@link createStream} instead
   */
  createPNGStream(opts?: PngConfig) {
    return this.createStream('png', opts);
  }

  /**
   * @deprecated use {@link createStream} instead
   */
  createJPEGStream(opts?: JpegConfig) {
    return this.createStream('jpeg', opts);
  }

  createStream<T extends keyof StreamSpec>(
    type: T,
    opts?: StreamSpec[T]['options']
  ): StreamSpec[T]['stream'] {
    const el = this.lowerCanvasEl;
    switch (type) {
      case 'png':
      default:
        return el.createPNGStream(opts as PngConfig);
      case 'jpeg':
        return el.createJPEGStream(opts as JpegConfig);
      case 'pdf':
        return el.createPDFStream(opts as PdfConfig);
    }
  }
}

export { StaticCanvas as Canvas };

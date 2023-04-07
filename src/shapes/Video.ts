import { ObjectEvents } from '../EventTypeDefs';
import { getDocument } from '../env';
import { LoadImageOptions } from '../util/misc/objectEnlive';
import { Image, ImageProps, SerializedImageProps } from './Image';
import { TProps } from './Object/types';

export interface VideoProps extends ImageProps {
  loop?: boolean;
}

export type VideoEvents = ObjectEvents & {
  loaded: never;
};

/**
 * ## IMPORTANT
 * Calling {@link HTMLVideoElement#play} before the user interacts with the window will throw an error
 */
export class Video<
  Props extends TProps<VideoProps> = Partial<VideoProps>,
  SProps extends SerializedImageProps = SerializedImageProps,
  EventSpec extends VideoEvents = VideoEvents
> extends Image<HTMLVideoElement, Props, SProps, EventSpec> {
  /**
   * keep a ref to the disposer in case the canvas ref is voided during video playing
   */
  private _renderLoopDisposer?: VoidFunction;
  private __disposer?: () => void;

  constructor(elementId: string, options?: Props);
  constructor(element: HTMLVideoElement, options?: Props);
  constructor(arg0: HTMLVideoElement | string, options: Props = {} as Props) {
    super(arg0, options);
    const el = this.getElement();
    const start = () => {
      this._renderLoopDisposer = this.canvas?.startRenderAllLoop();
    };
    const stop = () => this._renderLoopDisposer?.();
    el.addEventListener('play', start);
    el.addEventListener('pause', stop);
    el.addEventListener('ended', stop);
    this._setWidthHeight(options);
    el.addEventListener(
      'loadedmetadata',
      () => {
        this._setWidthHeight(options);
        this.setCoords();
      },
      {
        once: true,
      }
    );
    el.addEventListener(
      'loadeddata',
      () => {
        this.fire('loaded');
        this.canvas?.requestRenderAll();
      },
      {
        once: true,
      }
    );
    el.addEventListener('seeking', () => this.canvas?.requestRenderAll());
    el.addEventListener('seeked', () => this.canvas?.requestRenderAll());
    this.__disposer = () => {
      stop();
      el.removeEventListener('play', start);
      el.removeEventListener('pause', stop);
      el.removeEventListener('ended', stop);
      delete this.__disposer;
    };
  }

  set loop(value: boolean) {
    this.getElement().loop = value;
  }

  shouldCache(): boolean {
    return false;
  }

  getOriginalSize(element = this.getElement()) {
    if (!element) {
      return {
        width: 0,
        height: 0,
      };
    }
    return {
      width: element.videoWidth || element.width,
      height: element.videoHeight || element.height,
    };
  }

  dispose(): void {
    this.__disposer?.();
    super.dispose();
  }

  static load(url: string, { crossOrigin = null }: LoadImageOptions = {}) {
    const el = getDocument().createElement('video');
    el.crossOrigin = crossOrigin;
    el.src = url;
    return el;
  }
}

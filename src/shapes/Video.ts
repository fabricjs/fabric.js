import { classRegistry } from '../ClassRegistry';
import { ObjectEvents } from '../EventTypeDefs';
import { Canvas } from '../canvas/Canvas';
import { getDocument, getEnv } from '../env';
import { TSize } from '../typedefs';
import { LoadImageOptions, loadImage } from '../util/misc/objectEnlive';
import { ImageProps, ImageSource, SerializedImageProps } from './Image';
import { TProps } from './Object/types';

export interface VideoProps extends ImageProps {
  loop?: boolean;
}

const VIDEO_EVENTS /*: (keyof HTMLVideoElementEventMap)[] */ = [
  'loadedmetadata',
  'loadeddata',
  'play',
  'pause',
  'ended',
  'seeking',
  'seeked',
  'ratechange',
  'volumechange',
  'timeupdate',
  'enterpictureinpicture',
  'leavepictureinpicture',
  'error',
  'progress',
  'waiting',
] as const;

type UniqueVideoEvents = typeof VIDEO_EVENTS[number];

export type VideoEvents = ObjectEvents &
  Record<UniqueVideoEvents, { e: Event }> & {
    posterloaded: { poster: HTMLImageElement };
  };

/**
 * ## IMPORTANT
 * Calling {@link HTMLVideoElement#play} before the user interacts with the window will throw an error
 */
export class Video<
  Props extends TProps<VideoProps> = Partial<VideoProps>,
  SProps extends SerializedImageProps = SerializedImageProps,
  EventSpec extends VideoEvents = VideoEvents
> extends ImageSource<HTMLVideoElement, Props, SProps, EventSpec> {
  static ownDefaults: Record<string, any> = {
    objectCaching: false,
  };

  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...this.ownDefaults,
    };
  }

  private _started = false;
  private _posterElement?: HTMLImageElement;
  private _posterAbortController?: AbortController;

  constructor(elementId: string, options?: Props);
  constructor(element: HTMLVideoElement, options?: Props);
  constructor(arg0: HTMLVideoElement | string, options: Props = {} as Props) {
    super(arg0, options);
    const el = this._originalElement;
    const fire = (e: Event) => this.fire(e.type as UniqueVideoEvents, { e });
    VIDEO_EVENTS.forEach((eventType) => {
      el.addEventListener(eventType, fire);
    });
    // set dimensions in case metadata wasn't loaded yet
    this.once('loadedmetadata', () => {
      this._setWidthHeight(options);
      this.setCoords();
    });
    this.once('play', () => {
      this._started = true;
    });
  }

  getElement(): HTMLVideoElement {
    return this._originalElement;
  }

  setElement(element: HTMLVideoElement, size?: Partial<TSize>): void {
    super.setElement(element, size);
    if (element.poster) {
      this.setPoster(element.poster).then(
        (done) =>
          done && this.fire('posterloaded', { poster: this._posterElement! })
      );
    }
  }

  setPoster(url: string): Promise<boolean>;
  setPoster(el: HTMLImageElement): Promise<boolean>;
  setPoster(arg0: string | HTMLImageElement) {
    const prevController = this._posterAbortController;
    prevController && !prevController.signal.aborted && prevController.abort();
    return Promise.resolve().then(async () => {
      if (!this._started) {
        const controller = (this._posterAbortController =
          new AbortController());
        const disposer = this.once('play', () => {
          controller.abort();
          if (this._posterElement) {
            getEnv().dispose(this._posterElement);
            this._posterElement = undefined;
          }
        });
        controller.signal.addEventListener('abort', () => disposer());
        this._posterElement =
          typeof arg0 === 'string'
            ? await loadImage(arg0, controller).catch((err) => {
                disposer();
                console.error(err);
                return undefined;
              })
            : arg0;
        this.canvas?.requestRenderAll();
        return true;
      }
      return false;
    });
  }

  _set(key: string, value: any) {
    if (key === 'canvas') {
      this.canvas instanceof Canvas &&
        this.canvas.videoPlayerManager.remove(this);
      value instanceof Canvas && value.videoPlayerManager.add(this);
    }

    return super._set(key, value);
  }

  set loop(value: boolean) {
    this.getElement().loop = value;
  }

  isCacheDirty(): boolean {
    return true;
  }

  protected renderPlaceHolder(ctx: CanvasRenderingContext2D) {
    this._posterElement
      ? this.renderImage(ctx, this._posterElement)
      : ctx.fillRect(
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
  }

  _renderFill(ctx: CanvasRenderingContext2D) {
    !this._started && this.renderPlaceHolder(ctx);
    super._renderFill(ctx);
  }

  _render(ctx: CanvasRenderingContext2D): void {
    this.filters.length > 0 && this._started && this.applyFilters();
    super._render(ctx);
  }

  toString() {
    return `#<Video: { src: "${this.getSrc()}" }>`;
  }

  dispose(): void {
    super.dispose();
    this._posterAbortController?.abort();
    if (this._posterElement) {
      getEnv().dispose(this._posterElement);
      this._posterElement = undefined;
    }
  }

  static async fromObject<T extends TProps<SerializedImageProps>>(
    { src = '', crossOrigin: x = null, ...object }: T,
    { crossOrigin = x, ...options }: LoadImageOptions = {}
  ) {
    const el = getDocument().createElement('video');
    crossOrigin && (el.crossOrigin = crossOrigin);
    el.src = src;
    return this._fromObject<Video>(
      {
        ...object,
        src,
        crossOrigin,
        imageSource: el,
      },
      options
    );
  }
}

classRegistry.setClass(Video);

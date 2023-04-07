import { classRegistry } from '../ClassRegistry';
import { ObjectEvents } from '../EventTypeDefs';
import { Canvas } from '../canvas/Canvas';
import { getDocument } from '../env';
import { LoadImageOptions } from '../util/misc/objectEnlive';
import { Image, ImageProps, SerializedImageProps } from './Image';
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
  'error',
  'progress',
  'waiting',
] as const;

type UniqueVideoEvents = typeof VIDEO_EVENTS[number];

export type VideoEvents = ObjectEvents &
  Record<UniqueVideoEvents, { e: Event }>;

/**
 * ## IMPORTANT
 * Calling {@link HTMLVideoElement#play} before the user interacts with the window will throw an error
 */
export class Video<
  Props extends TProps<VideoProps> = Partial<VideoProps>,
  SProps extends SerializedImageProps = SerializedImageProps,
  EventSpec extends VideoEvents = VideoEvents
> extends Image<HTMLVideoElement, Props, SProps, EventSpec> {
  private started = false;

  constructor(elementId: string, options?: Props);
  constructor(element: HTMLVideoElement, options?: Props);
  constructor(arg0: HTMLVideoElement | string, options: Props = {} as Props) {
    super(arg0, options);
    const el = this.getElement();
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
      this.started = true;
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

  protected renderPlaceHolder(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }

  _renderFill(ctx: CanvasRenderingContext2D) {
    !this.started && this.renderPlaceHolder(ctx);
    super._renderFill(ctx);
  }

  static load(url: string, { crossOrigin = null }: LoadImageOptions = {}) {
    const el = getDocument().createElement('video');
    crossOrigin && (el.crossOrigin = crossOrigin);
    el.src = url;
    return el;
  }
}

classRegistry.setClass(Video);

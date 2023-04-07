import type { Video } from '../shapes/Video';
import type { Canvas } from './Canvas';

/**
 * In charge of synchronizing all interactive text instances of a canvas
 */
export class VideoPlayerManager {
  private targets = new Map<
    Video,
    { playing: boolean; disposer: VoidFunction }
  >();
  readonly canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  add(target: Video) {
    const render = () => this.canvas?.requestRenderAll();
    const disposers = [
      target.on('play', () => this.start(target)),
      target.on('pause', () => this.stop(target)),
      target.on('ended', () => this.stop(target)),
      ...(['loadeddata', 'seeking', 'seeked'] as const).map((eventType) =>
        target.on(eventType, render)
      ),
    ];

    this.targets.set(target, {
      playing: false,
      disposer: () => disposers.forEach((d) => d()),
    });
  }

  remove(target: Video) {
    this.targets.get(target)?.disposer();
    this.targets.delete(target);
  }

  isActive() {
    const it = this.targets.values();
    let next = it.next();
    while (!next.done) {
      if (next.value.playing) return true;
      next = it.next();
    }
    return false;
  }

  private start(target: Video) {
    !this.isActive() && this.canvas.startRenderAllLoop();
    this.setPlaying(target, true);
  }

  private stop(target: Video) {
    this.setPlaying(target, false);
    !this.isActive() && this.canvas.stopRenderAllLoop();
  }

  private setPlaying(target: Video, value: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.targets.get(target)!.playing = value;
  }

  dispose() {
    // @ts-expect-error disposing
    this.targets = null;
  }
}
